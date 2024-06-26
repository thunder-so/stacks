import { Aws, App, Stack, Environment } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as appconfig from 'aws-cdk-lib/aws-appconfig';
import { Construct } from 'constructs';
import { ApplicationConstruct } from './application';

export interface IEnvironmentProps {
    applicationConstruct: ApplicationConstruct;
    applicationName: string;
    environmentName: string;
}

export class EnvironmentConstruct extends Construct {
    public readonly Environment: appconfig.CfnEnvironment;
    public readonly ConfigurationProfile: appconfig.CfnConfigurationProfile;

    constructor(scope: Construct, id: string, props: IEnvironmentProps) {
        super(scope, id)

        // Create an IAM role for AppConfig retrieval
        const retrievalRole = new iam.Role(this, `AppConfigRetrievalRole-${props.applicationName}-${props.environmentName}`, {
            assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
        });

        // Grant AppConfig permission to retrieve configurations
        retrievalRole.addToPolicy(new iam.PolicyStatement({
            actions: ['ssm:GetParameters'],
            resources: ['*'],
        }));

        // Create an AppConfig environment
        const environment = new appconfig.CfnEnvironment(this, `AppConfigEnvironment-${props.applicationName}-${props.environmentName}`, {
          applicationId: props.applicationConstruct.Application.ref,
          name: props.environmentName,
        });

        // Create an AppConfig configuration profile
        const configProfile = new appconfig.CfnConfigurationProfile(this, `AppConfigConfigurationProfile-${props.applicationName}-${props.environmentName}`, {
            applicationId: props.applicationConstruct.Application.ref,
            name: `${props.environmentName}-configuration-profile`,
            locationUri: 'hosted',
            // retrievalRoleArn: retrievalRole.roleArn,
        });

        this.Environment = environment;
        this.ConfigurationProfile = configProfile;
    }
}