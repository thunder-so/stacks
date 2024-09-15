import { App } from "aws-cdk-lib";
import { SPAStack, type SPAProps } from "../../../";
// import { SPAStack, type SPAProps } from "@thunderso/cdk-spa";

const appStackProps: SPAProps = {
  env: {
    account: '665186350589',
    region: 'us-east-1'
  },
  application: 'examples',

  service: 'astro',
  serviceId: 'cly3wc6lb000312941gk0xres',
  environment: 'prod',
  environmentId: 'cly3wc4v600011294c9y38kkm',

  // Your Github repository url contains https://github.com/<owner>/<repo>
  sourceProps: {
    owner: 'thunder-so',
    repo: 'cdk-spa',
    branchOrRef: 'main',
    rootdir: 'examples/astro/'
  },

  // Auto deployment
  // - create a Github personal access token
  // - store in Secrets Manager as plaintext
  githubAccessTokenArn: 'arn:aws:secretsmanager:us-east-1:665186350589:secret:githubpat-0abFlT',

  // Either provide a buildspec.yml file OR fill out buildProps
  // - providing a buildspec.yml will override buildProps and sourceProps.rootdir
  buildSpecFilePath: 'stack/buildspec.yml',
  buildProps: {
    runtime: 18, // nodejs version
    installcmd: "npm ci",
    buildcmd: "npx astro build",
    outputdir: "dist/"
  },

  // Custom CloudFront Functions for URL rewrite
  edgeFunctionFilePath: 'stack/urlrewrite.js',

  buildEnvironmentVariables: {
    VITE_URL: { value: '/thunder/examples/astro' }
  },

  // domain: 'astro.thunder.so',
  // globalCertificateArn: 'arn:aws:acm:us-east-1:665186350589:certificate/d7c10cb1-d3fb-4547-b6ba-1717f20a25cf',
  // hostedZoneId: 'Z04172542KY36VFH88DJJ', // thunder.so

  eventArn: "arn:aws:lambda:us-east-1:665186350589:function:WatcherFunction-sandbox"
};

new SPAStack(new App(), `${appStackProps.application}-${appStackProps.service}-${appStackProps.environment}-stack`, appStackProps);
