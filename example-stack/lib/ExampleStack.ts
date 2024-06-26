import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { ApplicationConstruct, EnvironmentConstruct } from '../../constructs';
import { ExampleProps } from './ExampleProps'; 

export class ExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: ExampleProps) {
    super(scope, id, props);

    // Check mandatory properties
    if (!props?.env) {
      throw new Error('Must provide AWS account and region.');
    }
    if (!props.application || props.environment || props.service) {
      throw new Error('Mandatory stack properties missing.');
    }

    // Set up the AppConfig application
    const application = new ApplicationConstruct(this, 'Application', {
      applicationName: props.application,
    });
    
    // Set up the AppConfig environment and configuration profile
    const environment = new EnvironmentConstruct(this, 'Environment', {
      applicationConstruct: application,
      applicationName: props.application,
      environmentName: props.environment,
    });

    // Create an S3 bucket
    const bucket = new Bucket(this, `${props?.application}-${props?.service}-${props?.environment}-bucket` as string, {
      versioned: true
    });

    // Output 
    new CfnOutput(this, 'ApplicationConstructName', {
      value: application.Application.ref
    })
    new CfnOutput(this, 'EnvironmentConstructName', {
      value: environment.Environment.ref
    })
    new CfnOutput(this, 'BucketName', {
      value: bucket.BucketName.ref
    })

  }
}
