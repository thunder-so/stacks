import { App } from "aws-cdk-lib";
import { SPAStack, type SPAProps } from "../../";
// import { SPAStack, type SPAProps } from "@thunderso/cdk-spa";

const appStackProps: SPAProps = {
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
    installcmd: "npx pnpm i",
    buildcmd: "npx vitepress build docs",
    outputdir: "docs/.vitepress/dist/"
  }
  
};

new SPAStack(new App(), `${appStackProps.application}-${appStackProps.service}-${appStackProps.environment}-stack`, appStackProps);
