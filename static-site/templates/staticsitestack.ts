#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { StaticSiteStack, type StaticSiteProps } from "@thunderso/stacks/static-site";

const appStackProps: StaticSiteProps = {
  env: {
    account: 'your-account-id',
    region: 'us-east-1'
  },
  application: 'your-application-id',
  service: 'your-service-id',
  environment: 'production',

  // Your Github repository url contains https://github.com/<owner>/<repo>
  sourceProps: {
    owner: 'your-github-username',
    repo: 'your-repo-name',
    branchOrRef: 'main'
  },

  // Auto deployment
  // - create a Github personal access token
  // - store in Parameter Store (SecureString)
  githubAccessTokenArn: 'arn:aws:ssm:us-east-1:123456789012:parameter/github-token',

  // Either provide a buildspec.yml file OR leave empty and fill out buildProps
  buildSpecFilePath: './buildspec.yml',
  buildProps: {
    runtime: 20, // nodejs version
    installcmd: "npm ci",
    buildcmd: "npm run build",
    outputDir: "dist"
  },

  // Optional: Domain settings
  // - create a hosted zone for your domain
  // - issue a global tls certificate in us-east-1 
  domain: 'example.com',
  hostedZoneId: 'Z1D633PJRANDOM',
  globalCertificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-abcd-1234-abcd-1234abcd1234',

  // Custom Cloudfront Functions
  edgeFunctionFilePath: './edge.js',

  // Optional: functions
  enableAnalytics: true,
  enableAssetCleanup: true,

  // all resources created in the stack will be tagged
  // tags: {
  //   key: 'value'
  // },
};

new StaticSiteStack(new App(), `${appStackProps.application}-${appStackProps.environment}-${appStackProps.service}-stack`, appStackProps);