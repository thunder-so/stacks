import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApplicationConstruct, EnvironmentConstruct, HostingConstruct, PipelineConstruct } from '../../constructs';
import type { StaticSiteProps } from './StaticSiteProps'; 

export class StaticSiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StaticSiteProps) {
    super(scope, id, props);

    // Check mandatory properties
    if (!props?.env) {
      throw new Error('Must provide AWS account and region.');
    }
    if (!props.application || !props.environment || !props.service) {
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

    const hosting = new HostingConstruct(this, 'Hosting', {
      application: props.application,
      environment: props.environment,
      service: props.service,
    });

    const pipeline = new PipelineConstruct(this, 'Pipeline', {
      HostingBucket: hosting.hostingBucket,
      application: props.application,
      environment: props.environment,
      service: props.service,
      sourceProps: {
        owner: props.sourceProps?.owner, 
        repo: props.sourceProps?.repo, 
        branchOrRef: props.sourceProps?.branchOrRef, 
        rootdir: props.sourceProps?.rootdir ? props.sourceProps?.rootdir : ''
      },
      githubAccessTokenArn: props.githubAccessTokenArn as string,
    });

  }
}
