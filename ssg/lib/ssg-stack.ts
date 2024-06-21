import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import { ApplicationConstruct } from '../../constructs/application/lib';
import { EnvironmentConstruct } from '../../constructs/environment/lib';
import { PipelineConstruct } from '../../constructs/build/lib';

export interface SsgStackProps extends StackProps {
  applicationName: string;
  environmentName: string;
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

export class SsgStack extends Stack {
  
  constructor(scope: Construct, id: string, props?: SsgStackProps) {
    super(scope, id, props);

    if(props) {
      const application = new ApplicationConstruct(this, 'ApplicationConstruct', { 
        applicationName: props?.applicationName as string
      })

      const environment = new EnvironmentConstruct(this, 'EnvironmentConstruct', { 
        applicationConstruct: application,
        applicationName: props?.applicationName as string,
        environmentName: props?.environmentName as string
      })

      const construct = new CloudFrontToS3(this, 'CloudFrontToS3', {});

      const pipeline = new PipelineConstruct(this, 'PipelineConstruct', {
        applicationConstruct: application,
        applicationName: props?.applicationName as string,
        environmentName: props?.environmentName as string,
        cloudFrontToS3Construct: construct,
        sourceProps: props?.sourceProps,
        buildProps: props?.buildProps
      })

      new CfnOutput(this, 'ApplicationConstructName', {
        value: application.App.ref
      })
      new CfnOutput(this, 'EnvironmentConstructName', {
        value: environment.Environment.ref
      })
      new CfnOutput(this, 'PipelineConstructName', {
        value: pipeline.Pipeline.projectName
      })
      
    }
  }
}