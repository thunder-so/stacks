import { Aws, App, Environment, aws_s3 } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as defaults from '@aws-solutions-constructs/core';
import * as resources from '@aws-solutions-constructs/resources';
import { Construct } from 'constructs';
import { ApplicationConstruct } from '../../application/lib';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';

export interface PipelineProps {
    applicationConstruct: ApplicationConstruct;
    applicationName: string;
    environmentName: string;
    cloudFrontToS3Construct: CloudFrontToS3;
    sourceProps: {
        owner: string,
        repo: string,
        branchOrRef: string
    }
    buildProps: {
        runtime: string;
        installcmd: string;
        buildcmd: string;
        outputDir: string;
    }
}

export class PipelineConstruct extends Construct {
    public readonly Pipeline: codebuild.Project;

    constructor(scope: Construct, id: string, props: PipelineProps) {
        super(scope, id)

        // Create a role for codebuild
        const codeBuildRole = new iam.Role(this, `CodeBuildRole-${props.applicationName}-${props.environmentName}`, {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
            roleName: `CodeBuildRole-${props.applicationName}-${props.environmentName}`
        });

        // Attach policies to role
        codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
        codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess'));
        codeBuildRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'));

        // Create CodeBuild Project
        const codeBuildProject = new codebuild.Project(this, `CodeBuildProject-${props.applicationName}-${props.environmentName}`, {
            projectName: `CodeBuildProject-${props.applicationName}-${props.environmentName}`,
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        'runtime-versions': {
                            nodejs: props.buildProps.runtime
                        },
                        commands: [ props.buildProps.installcmd ]
                    },
                    build: {
                        commands: [ props.buildProps.buildcmd ],
                    },
                },
                artifacts: {
                    files: ['**/*'],
                    'base-directory': props.buildProps.outputDir,
                }
            }),
            source: codebuild.Source.gitHub({
                cloneDepth: 1,
                owner: props.sourceProps.owner,
                repo: props.sourceProps.repo,
                branchOrRef: props.sourceProps.branchOrRef,
            }),
            artifacts: codebuild.Artifacts.s3({
                // @ts-ignore
                bucket: props.cloudFrontToS3Construct.s3BucketInterface,
                encryption: undefined, // Encryption disabled
            }),
            environment: {
                buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
                privileged: true,
                computeType: codebuild.ComputeType.SMALL,
            },
            role: codeBuildRole,
        });

        this.Pipeline = codeBuildProject;
    }
}