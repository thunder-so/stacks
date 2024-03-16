#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SsgStack } from '../lib/ssg-stack';

const app = new cdk.App();
new SsgStack(app, 'SsgStack', {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  env: { 
    account: process.env.ACCOUNT, 
    region: process.env.REGION 
  },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

  applicationName: process.env.APPLICATION_NAME as string,
  environmentName: process.env.ENVIRONMENT_NAME as string,
  sourceProps: {
    owner: process.env.SOURCE_OWNER as string,
    repo: process.env.SOURCE_REPO as string,
    branchOrRef: process.env.SOURCE_BRANCH_OR_REF as string,
  },
  buildProps: {
    runtime: process.env.BUILD_RUNTIME as string,
    installcmd: process.env.BUILD_INSTALLCMD as string,
    buildcmd: process.env.BUILD_BUILDCMD as string,
    outputDir: process.env.BUILD_OUTPUTDIR as string
  }
});