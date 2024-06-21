import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { ApplicationConstruct } from '../../constructs/application/lib';
import { EnvironmentConstruct } from '../../constructs/environment/lib';

export interface ExampleStackProps extends StackProps {
  applicationName: string;
  environmentName: string;
}

export class ExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: ExampleStackProps) {
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

      // Create an S3 bucket
      const bucket = new s3.Bucket(this, `${props?.applicationName}-${props?.environmentName}-bucket` as string, {
        versioned: true
      });

      new CfnOutput(this, 'ApplicationConstructName', {
        value: application.App.ref
      })
      new CfnOutput(this, 'EnvironmentConstructName', {
        value: environment.Environment.ref
      })
      new CfnOutput(this, 'BucketName', {
        value: bucket.BucketName.ref
      })
      
    }
  }
}
