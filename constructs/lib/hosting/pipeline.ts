import fs from 'fs';
import * as yaml from "yaml";
import { Construct } from "constructs";
import { Aws, Duration, RemovalPolicy, Stack, SecretValue } from 'aws-cdk-lib';
import { Bucket, type IBucket, BlockPublicAccess, ObjectOwnership, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Artifacts, Project, PipelineProject, LinuxBuildImage, LinuxArmBuildImage, ComputeType, Source, BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline, StageProps } from 'aws-cdk-lib/aws-codepipeline';
import { PolicyStatement, Effect, ArnPrincipal } from 'aws-cdk-lib/aws-iam';
import { GitHubSourceAction, CodeBuildAction, S3DeployAction, LambdaInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';

export interface PipelineProps {
  HostingBucket: IBucket;
  application: string;
  service: string;
  environment: string;

  // source
  sourceProps: {
    owner: string;
    repo: string;
    branchOrRef: string;
    rootdir: string;
  };
  githubAccessTokenArn: string;

  // build
  buildSpecFilePath?: string;
  buildProps?: {
    runtime: string;
    installcmd: string;
    buildcmd: string;
    outputDir: string;
  };

  // edge function
  edgeFunctionFilePath?: string;
}

export class PipelineConstruct extends Construct {

  /**
   * The buildstep
   */
  public codeBuildProject: Project;

  /**
   * The pipeline
   */
  public codePipeline: Pipeline;

  /**
   * The commit reference hash
   */
  public commitId: string;

  /**
   * The build output bucket
   */
  public buildOutputBucket: IBucket;

  /**
   * The Lambda function for sync.js
   */
  public syncBucketsFunction: Function;


  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id);

    // output bucket
    this.buildOutputBucket = new Bucket(this, "BuildOutputBucket", {
      bucketName: `${props.application}-${props.service}-${props.environment}-output`,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      enforceSSL: true,
    });

    this.codeBuildProject = this.createBuildProject(props);
    this.codePipeline = this.createPipeline(props);      

    // Define the lambda function for syncing buckets
    this.syncBucketsFunction = new Function(this, 'SyncBucketsFunction', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'sync.handler',
      code: Code.fromAsset('../functions/sync.js'),
      environment: {
        PIPELINE_NAME: this.codePipeline.pipelineName,
        OUTPUT_BUCKET: this.buildOutputBucket.bucketName,
        COMMIT_ID: this.commitId,
        HOSTING_BUCKET: props.HostingBucket.bucketName,
      },
    });

    this.addSyncStepToPipeline();
  }

  private addSyncStepToPipeline() {
        // Sync Step
        this.codePipeline.addStage({
          stageName: 'Sync',
          actions: [
            new LambdaInvokeAction({
              actionName: 'SyncBucketsAction',
              lambda: this.syncBucketsFunction,
              runOrder: 4,
            }),
          ],
        });
  }

  // Function to get GitHub Access Token from SSM Parameter Store
  private getGithubAccessToken(arn: string): SecretValue {
    return SecretValue.ssmSecure(arn);
  }

  // private refParam(props: PipelineProps) {
  //   // Create a SSM Parameter to store the Github commit ref
  //   return new ssm.StringParameter(this, "RefParam", {
  //     parameterName: `/staticsite/svc-${props.service}/ref`,
  //     stringValue: "init",
  //     description: "commit ref",
  //     tier: ssm.ParameterTier.STANDARD,
  //   });
  // }

  // Create CodeBuild Project
  private createBuildProject(props: PipelineProps): Project {
    // build logs bucket
    const buildLogsBucket = new Bucket(this, "BuildLogsBucket", {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      enforceSSL: true,
    });

    // Read the buildspec.yml file
    let buildSpecYaml;
    if (props.buildSpecFilePath) {
      const buildSpecFile = fs.readFileSync(props.buildSpecFilePath, "utf8");
      buildSpecYaml = yaml.parse(buildSpecFile);  
    }

    // create the cloudbuild project
    const project = new Project(this, "CodeBuildProject", {
      projectName: `${props.application}-${props.service}-${props.environment}-buildproject`,
      buildSpec: 
        buildSpecYaml 
          ? BuildSpec.fromObject(buildSpecYaml) 
          : BuildSpec.fromObject({
            version: '0.2',
            phases: {
                install: {
                    'runtime-versions': {
                        nodejs: props.buildProps?.runtime
                    },
                    commands: [ 
                      `cd ${props.sourceProps?.rootdir}`,
                      // 'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"',
                      props.buildProps?.installcmd 
                    ]
                },
                build: {
                    commands: [ props.buildProps?.buildcmd ],
                },
            },
            artifacts: {
                files: ['**/*'],
                'base-directory': props.sourceProps?.rootdir,
                // bucket: this.buildOutputBucket.bucketName
            }
        }),
        source: Source.gitHub({
            cloneDepth: 1,
            owner: props.sourceProps.owner,
            repo: props.sourceProps.repo,
            branchOrRef: props.sourceProps.branchOrRef,
            webhook: true
        }),
        artifacts: Artifacts.s3({
            bucket: this.buildOutputBucket,
            encryption: undefined, // Encryption disabled
        }),
        environment: {
            // buildImage: LinuxBuildImage.STANDARD_7_0,
            // computeType: ComputeType.MEDIUM,
            buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
            computeType: ComputeType.SMALL,
            privileged: true,
        },
        // environmentVariables: codeBuildEnvVars,
        logging: {
          s3: {
            bucket: buildLogsBucket,
          }
        }
    });

    // Add permission for the project to write files in bucket
    this.buildOutputBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${this.buildOutputBucket.bucketArn}/*`],
        // @ts-ignore
        principals: [new ArnPrincipal(project.role.roleArn)],
      })
    );

    return project;
  }

  // Create pipeline
  private createPipeline(props: PipelineProps): Pipeline {
    // build artifact bucket
    const artifactBucket = new Bucket(this, "ArtifactBucket", {
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      enforceSSL: true,
    });

    // Setup CodePipeline
    const pipeline = new Pipeline(this, "Pipeline", {
      artifactBucket: artifactBucket,
      pipelineName: `${props.application}-${props.service}-${props.environment}-pipeline`,
      crossAccountKeys: false,
    });

    // Allow pipeline to read from the artifact bucket
    artifactBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:GetObject"],
        resources: [`${artifactBucket.bucketArn}/*`],
        principals: [new ArnPrincipal(pipeline.role.roleArn)],
      })
    );

    // Allow pipeline to write to the build output bucket
    this.buildOutputBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${this.buildOutputBucket.bucketArn}/*`],
        principals: [new ArnPrincipal(pipeline.role.roleArn)],
      })
    );

    // Source Step
    const githubAccessToken = this.getGithubAccessToken(props.githubAccessTokenArn);
    const sourceOutput = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: 'GithubSourceAction',
      owner: props.sourceProps.owner,
      repo: props.sourceProps.repo,
      branch: props.sourceProps.branchOrRef,
      oauthToken: githubAccessToken,
      output: sourceOutput,
    });
    
    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    this.commitId = sourceAction.variables.commitId;

    // Build Step
    const buildAction = new CodeBuildAction({
      actionName: `${props.application}-${props.service}-${props.environment}-buildaction`,
      project: this.codeBuildProject,
      input: sourceOutput,
      runOrder: 2,
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [buildAction],
    });

    // Deploy Step
    const deployAction = new S3DeployAction({
      actionName: `${props.application}-${props.service}-${props.environment}-deployaction`,
      input: sourceOutput,
      bucket: this.buildOutputBucket,
      objectKey: `${sourceAction.variables.commitId}/`, // store in commit hash directories
      runOrder: 3,
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });

    // return our pipeline
    return pipeline;
  }
}