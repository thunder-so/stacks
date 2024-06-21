import { Aws, App, Environment } from 'aws-cdk-lib';
import * as appconfig from 'aws-cdk-lib/aws-appconfig';
import * as defaults from '@aws-solutions-constructs/core';
import * as resources from '@aws-solutions-constructs/resources';
import { Construct } from 'constructs';

export interface ApplicationProps {
    applicationName: string;
}

export class ApplicationConstruct extends Construct {
    public readonly App: appconfig.CfnApplication;

    constructor(scope: Construct, id: string, props: ApplicationProps) {
        super(scope, id)

        const application = new appconfig.CfnApplication(this, `AppConfigApplication-${props.applicationName}`, {
            name: props.applicationName,
            description: `AppConfig Application for ${props.applicationName}`
        })

        this.App = application;
    }
}