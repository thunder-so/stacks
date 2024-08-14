import fs from 'fs';
import path from 'path';
import yaml from "yaml";
import { fileURLToPath } from 'url';
import { Construct } from "constructs";
import { Aws, Duration, RemovalPolicy, Stack, SecretValue, CfnParameter } from 'aws-cdk-lib';
import { PolicyStatement, Effect, ArnPrincipal, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Bucket, type IBucket, BlockPublicAccess, ObjectOwnership, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { Artifacts, GitHubSourceCredentials, Project, PipelineProject, LinuxBuildImage, LinuxArmBuildImage, ComputeType, Source, BuildSpec } from "aws-cdk-lib/aws-codebuild";
import { Artifact, Pipeline, PipelineType, StageProps } from 'aws-cdk-lib/aws-codepipeline';
import { GitHubSourceAction, GitHubTrigger, CodeBuildAction, S3DeployAction, LambdaInvokeAction } from 'aws-cdk-lib/aws-codepipeline-actions';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { IDistribution } from 'aws-cdk-lib/aws-cloudfront';

export interface PipelineProps {
  HostingBucket: IBucket;
  Distribution: IDistribution;

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
    runtime: number;
    installcmd: string;
    buildcmd: string;
    outputdir: string;
  };
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
   * Cloudfront Cache Invalidation - CodeBuild Project
   */
  public invalidationProject: Project;

  /**
   * The commit reference hash
   */
  public commitId: string;

  /**
   * The build output bucket
   */
  // public buildOutputBucket: IBucket;

  /**
   * The Lambda function for sync.js
   */
  // public syncBucketsFunction: Function;


  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id);

    // output bucket
    // this.buildOutputBucket = new Bucket(this, "BuildOutputBucket", {
    //   bucketName: `${props.application}-${props.service}-${props.environment}-output`,
    //   encryption: BucketEncryption.S3_MANAGED,
    //   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    //   objectOwnership: ObjectOwnership.OBJECT_WRITER,
    //   enforceSSL: true,
    //   removalPolicy: RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true,
    // });

    this.codeBuildProject = this.createBuildProject(props);
    this.invalidationProject = this.setupCacheInvalidation(props);
  
    // Lambda for syncing buckets
    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);
    // const syncFunctionPath = path.resolve(__dirname, '../functions/');

    // this.syncBucketsFunction = new Function(this, 'SyncBucketsFunction', {
    //   runtime: Runtime.NODEJS_20_X,
    //   handler: 'sync.handler',
    //   code: Code.fromAsset(syncFunctionPath)
    // });

    // create pipeline
    this.codePipeline = this.createPipeline(props);

    // Call the setup function to add environment variables and permissions   
    // this.setupSyncBucketsFunction(props);
    
  }


  /**
   * Configure a codebuild project to run a shell command 
   * @param props 
   * 
   */
  private setupCacheInvalidation(props: PipelineProps): Project {
    const cloudfrontInvalidationRole = new Role(this, 'CloudfrontInvalidationRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
    });
    
    cloudfrontInvalidationRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['cloudfront:CreateInvalidation'],
      resources: [`arn:aws:cloudfront::${props.Distribution.stack.account}:distribution/${props.Distribution.distributionId}`],
    }));

    const buildSpec = BuildSpec.fromObject({
      version: '0.2',
      phases: {
        build: {
          commands: [
            'aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"'
          ],
        },
      },
    });
    
   const project = new Project(this, 'CloudfrontInvalidationProject', {
      projectName: `${props.application}-${props.service}-${props.environment}-CacheInvalidation`,
      buildSpec: buildSpec,
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
        computeType: ComputeType.SMALL,
      },
      role: cloudfrontInvalidationRole,
      environmentVariables: {
        CLOUDFRONT_DISTRIBUTION_ID: { value: props.Distribution.distributionId },
      },
    });

    return project;
  }

  /**
   * Configure Lambda function for syncing buckets
   * @param props 
   *
  private setupSyncBucketsFunction(props: PipelineProps) {
    // this.syncBucketsFunction.addEnvironment('PIPELINE_NAME', this.codePipeline.pipelineName);
    this.syncBucketsFunction.addEnvironment('OUTPUT_BUCKET', this.buildOutputBucket.bucketName);
    this.syncBucketsFunction.addEnvironment('COMMIT_ID', this.commitId);
    this.syncBucketsFunction.addEnvironment('HOSTING_BUCKET', props.HostingBucket.bucketName);
  
    // grant lambda permission to talk to pipeline
    this.syncBucketsFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "codepipeline:PutJobSuccessResult",
        "codepipeline:PutJobFailureResult"
      ],
      resources: [
        "*",
        // this.codePipeline.pipelineArn
      ],
    }));
  
    // Grant permissions to read from the build output bucket
    this.syncBucketsFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject', 's3:ListBucket'],
      resources: [
        this.buildOutputBucket.bucketArn,
        `${this.buildOutputBucket.bucketArn}/*`
      ],
    }));
  
    // Grant permissions to write to the hosting bucket
    this.syncBucketsFunction.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:PutObject'],
      resources: [
        props.HostingBucket.bucketArn,
        `${props.HostingBucket.bucketArn}/*`
      ],
    }));
  }
  
  /**
   * Create CodeBuild Project
   * @param props 
   * @returns project
   */
  private createBuildProject(props: PipelineProps): Project {
    const bucketNamePrefix = `${props.application}-${props.service}-${props.environment}`;

    // build logs bucket
    const buildLogsBucket = new Bucket(this, "BuildLogsBucket", {
      bucketName: `${bucketNamePrefix}-build-logs`,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Read the buildspec.yml file
    let buildSpecYaml;
    if (props.buildSpecFilePath) {
      const buildSpecFile = fs.readFileSync(props.buildSpecFilePath, "utf8");
      buildSpecYaml = yaml.parse(buildSpecFile);  
    } else {
      buildSpecYaml = BuildSpec.fromObject({
        version: '0.2',
        phases: {
            install: {
                'runtime-versions': {
                    nodejs: props.buildProps?.runtime || '20'
                },
                commands: [ 
                  `cd ${props.sourceProps?.rootdir || '.'}`,
                  // 'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*"',
                  props.buildProps?.installcmd || 'npm install'
                ]
            },
            build: {
                commands: [ props.buildProps?.buildcmd || 'npm run build'],
            },
        },
        artifacts: {
            files: ['**/*'],
            'base-directory': `${props.sourceProps.rootdir}${props.buildProps?.outputdir}` 
        }
      })
    }

    
    // create the cloudbuild project
    const project = new Project(this, "CodeBuildProject", {
      projectName: `${props.application}-${props.service}-${props.environment}-buildproject`,
      buildSpec: buildSpecYaml,
        
      source: Source.gitHub({
        cloneDepth: 1,
        owner: props.sourceProps.owner,
        repo: props.sourceProps.repo,
        branchOrRef: props.sourceProps.branchOrRef,
        // webhook: true
      }),
      // artifacts: Artifacts.s3({
      //     bucket: this.buildOutputBucket,
      //     encryption: undefined, // Encryption disabled
      // }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_7_0,
        computeType: ComputeType.MEDIUM,
        // buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
        // computeType: ComputeType.MEDIUM,
        privileged: true,
      },
      // environmentVariables: codeBuildEnvVars,
      logging: {
        s3: {
          bucket: buildLogsBucket,
        }
      }
    });

    // allow project to get secrets
    project.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [props.githubAccessTokenArn]
      })
    );

    // Grant project permission to write files in output bucket
    // this.buildOutputBucket.addToResourcePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ["s3:PutObject"],
    //     resources: [`${this.buildOutputBucket.bucketArn}/*`],
    //     // @ts-ignore
    //     principals: [new ArnPrincipal(project.role.roleArn)],
    //   })
    // );

    // Grant project read/write permissions on hosting bucket
    props.HostingBucket.grantReadWrite(project.grantPrincipal);

    return project;
  }

  /**
   * Create the CodePipeline
   * @param props 
   * @returns pipeline
   */
  private createPipeline(props: PipelineProps): Pipeline {
    const bucketNamePrefix = `${props.application}-${props.service}-${props.environment}`;

    // build artifact bucket
    const artifactBucket = new Bucket(this, "ArtifactBucket", {
      bucketName: `${bucketNamePrefix}-artifacts`,
      encryption: BucketEncryption.S3_MANAGED,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Setup CodePipeline
    const pipeline = new Pipeline(this, "Pipeline", {
      artifactBucket: artifactBucket,
      pipelineName: `${props.application}-${props.service}-${props.environment}-pipeline`,
      crossAccountKeys: false,
      pipelineType: PipelineType.V2
    });

    // Allow pipeline to read secrets
    pipeline.role.addToPrincipalPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [props.githubAccessTokenArn]
      })
    );

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
    // this.buildOutputBucket.addToResourcePolicy(
    //   new PolicyStatement({
    //     effect: Effect.ALLOW,
    //     actions: ["s3:PutObject"],
    //     resources: [`${this.buildOutputBucket.bucketArn}/*`],
    //     principals: [new ArnPrincipal(pipeline.role.roleArn)],
    //   })
    // );

    // Allow pipeline to write to the hosting bucket
    props.HostingBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject"],
        resources: [`${props.HostingBucket.bucketArn}/*`],
        principals: [new ArnPrincipal(pipeline.role.roleArn)],
      })
    );

    // Source Step
    const sourceOutput = new Artifact();
    const buildOutput = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: 'GithubSourceAction',
      owner: props.sourceProps.owner,
      repo: props.sourceProps.repo,
      branch: props.sourceProps.branchOrRef,
      oauthToken: SecretValue.secretsManager(props.githubAccessTokenArn),
      output: sourceOutput,
      trigger: GitHubTrigger.WEBHOOK
    });
    
    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });

    // extract the commitId from the sourceAction
    this.commitId = sourceAction.variables.commitId;

    // Build Step
    const buildAction = new CodeBuildAction({
      actionName: 'BuildAction',
      project: this.codeBuildProject,
      input: sourceOutput,
      outputs: [buildOutput],
      runOrder: 2,
    });

    pipeline.addStage({
      stageName: "Build",
      actions: [buildAction],
    });

    // Deploy Step
    // const deployAction = new S3DeployAction({
    //   actionName: 'DeployAction',
    //   input: buildOutput,
    //   bucket: this.buildOutputBucket,
    //   objectKey: `${sourceAction.variables.commitId}`, // store in commit hash directories
    //   runOrder: 3,
    // });

    // Deploy directly to Hosting Bucket
    const deployAction = new S3DeployAction({
      actionName: 'DeployAction',
      input: buildOutput,
      bucket: props.HostingBucket,
      runOrder: 3,
    });

    pipeline.addStage({
      stageName: "Deploy",
      actions: [deployAction],
    });

    // Cache invalidation step
    const invalidateAction = new CodeBuildAction({
      actionName: 'InvalidateAction',
      project: this.invalidationProject,
      input: buildOutput,
      runOrder: 4,
    });

    pipeline.addStage({
      stageName: 'InvalidateCache',
      actions: [invalidateAction]
    })

    // Sync step
    // pipeline.addStage({
    //   stageName: 'Sync',
    //   actions: [
    //     new LambdaInvokeAction({
    //       actionName: 'SyncBucketsAction',
    //       inputs: [buildOutput],
    //       lambda: this.syncBucketsFunction,
    //       runOrder: 4
    //     }),
    //   ],
    // });

    // return our pipeline
    return pipeline;
  }
}