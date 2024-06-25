import { Aws, App, Stack, Environment } from 'aws-cdk-lib';
import * as appconfig from 'aws-cdk-lib/aws-appconfig';
import { Construct } from 'constructs';

export interface IApplicationProps {
  applicationName: string;
}

export class ApplicationConstruct extends Construct {
  public readonly Application: appconfig.CfnApplication;

  constructor(scope: Construct, id: string, props: IApplicationProps) {
    super(scope, id)

    const application = new appconfig.CfnApplication(this, `AppConfigApplication-${props.applicationName}`, {
      name: props.applicationName,
      description: `AppConfig Application for ${props.applicationName}`
    })

    this.Application = application;
  }
}