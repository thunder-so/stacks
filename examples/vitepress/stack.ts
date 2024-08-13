#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { StaticSiteStack, type StaticSiteProps } from "../../../stacks/static-site";
// import { StaticSiteStack, type StaticSiteProps } from "@thunderso/stacks/static-site";

const appStackProps: StaticSiteProps = {
  env: {
    account: '665186350589',
    region: 'us-east-1'
  },
  application: 'examples',
  service: 'vitepress',
  environment: 'test',

  // Your Github repository url contains https://github.com/<owner>/<repo>
  sourceProps: {
    owner: 'thunder-so',
    repo: 'stacks',
    branchOrRef: 'main',
    rootdir: 'examples/vitepress/'
  },

  // Auto deployment
  // - create a Github personal access token as plaintext
  // - store in Secrets Manager
  githubAccessTokenArn: 'arn:aws:secretsmanager:us-east-1:665186350589:secret:githubpat-0abFlT',

  // Either provide a buildspec.yml file OR leave empty and fill out buildProps
  // buildSpecFilePath: '',
  buildProps: {
    runtime: 18, // nodejs version
    installcmd: "npx pnpm i --store=node_modules/.pnpm-store",
    buildcmd: "pnpm run build",
    outputdir: "docs/.vitepress/dist/"
  }
};

new StaticSiteStack(new App(), `${appStackProps.application}-${appStackProps.environment}-${appStackProps.service}-stack`, appStackProps);
