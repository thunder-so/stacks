import { App } from "aws-cdk-lib";
import { SPAStack, type SPAProps } from "../../";
// import { SPAStack, type SPAProps } from "@thunderso/cdk-spa";

const appStackProps: SPAProps = {
  env: {
    account: '665186350589',
    region: 'us-east-1'
  },
  application: 'examples',
  service: 'vuejs',
  environment: 'dev',

  // Your Github repository url contains https://github.com/<owner>/<repo>
  sourceProps: {
    owner: 'thunder-so',
    repo: 'stacks',
    branchOrRef: 'main',
    rootdir: 'examples/vuejs/'
  },

  // Auto deployment
  // - create a Github personal access token
  // - store in Secrets Manager as plaintext
  githubAccessTokenArn: 'arn:aws:secretsmanager:us-east-1:665186350589:secret:githubpat-0abFlT',

  // Either provide a buildspec.yml file OR leave empty and fill out buildProps
  // buildSpecFilePath: '',
  buildProps: {
    runtime: 20, // nodejs version
    installcmd: "npm ci",
    buildcmd: "npm run build",
    outputdir: "dist/"
  }
};

new SPAStack(new App(), `${appStackProps.application}-${appStackProps.environment}-${appStackProps.service}-stack`, appStackProps);
