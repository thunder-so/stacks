# AWS CDK Deployment Stack for SSG & SPA

Easily deploy static site generators and client-only SPA (single page applications) via CDK on AWS.

- Fast responses from [Cloudfront](https://aws.amazon.com/cloudfront/)
- Automatic upload of the build files for CSR and static assets to [S3](https://aws.amazon.com/s3/) with optimized caching rules
- Automatic cleanup of outdated static assets and build files
- Publicly available by a custom domain (or subdomain) via [Route53](https://aws.amazon.com/route53/)
- Automatic build and deploy with [CodeBuild](https://aws.amazon.com/codebuild/) and [CodePipeline](https://aws.amazon.com/codepipeline/) from [Github](https://github.com/) repository.
- Access logs analysis via [Athena](https://aws.amazon.com/athena/) for the site's CloudFront distribution

## Prerequisites

You need an [AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/) to create and deploy the required resources for the site on AWS.

This package uses the npm package manager and is an ESM module.

## Installation

Install the package and its required dependencies:

```
npm install thunder-so/stacks --dev
```


## Setup

1. Login into the AWS console and note the `Account ID`. You will need it in the configuration step.

2. Run the following command to automatically create the required CDK stack entrypoint at `stack/index.ts`. This file defines the config how the Nuxt app will be deployed via CDK. You should adapt the file to the project's needs, especially the props `env.account` (setup step 1).


```bash
npx cdk-staticsite-init 
```
The executable file can be found at

```bash
node_modules/.bin/cdk-staticsite-init
```

### Manage Domain with Route53 (Optional)

1. [Create a hosted zone in Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/AboutHZWorkingWith.html) for the desired domain, if you don't have one yet.
This is required to create DNS records for the domain to make the app publicly available on that domain. 
On the hosted zone details you should see the `Hosted zone ID` of the hosted zone.

2. [Request a public global certificate in the AWS Certificate Manager (ACM)](https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html) for the desired domain in `us-east-1` *(global)* and validate it, if you don't have one yet.
This is required to provide the app via HTTPS on the public internet. Take note of the displayed `ARN` for the certificate. 

> [!IMPORTANT]
> The certificate must be issued in `us-east-1` *(global)* regardless of the region used for the app itself as it will be attached to the Cloudfront distribution which works globally.



## Configuration

The `StaticSiteStack` construct can be configured via the following props:

<table width="100%">
  <thead align=left>
    <tr>
      <th width=150>
        name
      </th>
      <th width=70>
        type
      </th>
      <th>
        description
      </th>
    </tr>
  </thead>
  <tbody align=left valign=top>
    <tr>
      <th>
        <code>env.account</code> and <code>env.region</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. Your account ID and your preferred region.
      </td>
    </tr>
    <tr>
      <th>
        <code>application</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. A string identifier for the project the site is part of. An application might have multiple different services.
      </td>
    </tr>
    <tr>
      <th>
        <code>service</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Required</strong>. A string identifier for the project's service the app is created for. This can be seen as the name of the app.
      </td>
    </tr>
    <tr id="constructor-option-environment">
      <th>
        <code>environment</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td><strong>Required</strong>. A string to identify the environment of the app. This enables us to deploy multiple different environments of the same app, e.g., production and development.
      </td>
    </tr>
    <tr><td></td></tr>
    <tr>
      <th>
        <code>enableDomain</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td><strong>Optional</strong>. Whether to manage domains using Route53 and ACM. Defaults to <code>false</code>
      </td>
    </tr>
    <tr id="constructor-option-domain">
      <th>
        - <code>domain</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Optional</strong>. The domain (without the protocol) at which the app shall be publicly available. A DNS record will be automatically created in Route53 for the domain. This also supports subdomains. Examples: "example.com", "sub.example.com"
      </td>
    </tr>
    <tr>
      <th>
        - <code>globalCertificateArn</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Optional</strong>. The ARN of the certificate to use on CloudFront for the app to make it accessible via HTTPS. The certificate must be issued for the specified domain in us-east-1 (global) regardless of the region specified via 'env.region' as CloudFront only works globally.
      </td>
    </tr>
    <tr>
      <th>
        - <code>hostedZoneId</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td>
        <strong>Optional</strong>. The id of the hosted zone to create a DNS record for the specified domain.
      </td>
    </tr>
    <tr><td></td></tr>
    <tr>
      <th>
        <code>enableAccessLogAnalysis</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td><strong>Optional</strong>. Whether to provision Athena for Cloudfront access logs analysis. Defaults to <code>false</code>
      </td>
    </tr>
    <tr>
      <th>
        <code>enableAssetCleanup</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td><strong>Optional</strong>. Whether to provision Lambda and EventBridge rule to cleanup stale static assets. Defaults to <code>false</code>
      </td>
    </tr>
    <tr><td></td></tr>
    <tr>
      <th>
        <code>enableDeployment</code>
      </th>
      <th>
        <code>boolean</code>
      </th>
      <td><strong>Optional</strong>. Whether to provision CodeBuild to automatically build your code from Github repository. Defaults to <code>false</code>
      </td>
    </tr>
    <tr>
      <th>
        - <code>githubAccessTokenArn</code>
      </th>
      <th>
        <code>string</code>
      </th>
      <td><strong>Optional</strong>.
      </td>
    </tr>
  </tbody>
</table>


## Deployment

After the installation and the setup you are already good to go to build the Nuxt app and to deploy it to AWS with this package by following the steps below:

### 1. Bootstrap CDK

Deploying stacks with the AWS CDK requires dedicated Amazon S3 buckets and other containers to be available to AWS CloudFormation during deployment. Creating these is called bootstrapping and is only required once per account and region. To bootstrap, run the following command:

```
cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```

See https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html for details.

### 2. Build and Deploy

By running the following script, the Nuxt app will be built automatically via `yarn build` 
and the CDK stack will be deployed to AWS.

```bash
npx cdk-staticsite-deploy
```
The executable file:

```bash
node_modules/.bin/cdk-staticsite-deploy
```

Alternatively, you can run the following commands separately to customize the deployment process:

```bash
# tsx
npx cdk deploy --require-approval never --app "npx tsx stack/index.ts"

# ts-node 
npx cdk deploy --require-approval never --all --app="npx ts-node stack/index.ts" 
```

## Destroy the Stack

If you want to destroy the stack and all its resources (including storage, e.g., access logs), run the following script:


```bash
npx cdk-staticsite-destroy
```
The executable file:
```bash
node_modules/.bin/cdk-staticsite-destroy
```

## Reference: Created AWS Resources

In the following, you can find an overview of the AWS resources that will be created by this package for reference.

### StaticSiteStack

This stack is responsible for deploying static sites and dynamic SPA apps to AWS.
The following AWS resources will be created by this stack:

- [CloudFront](https://aws.amazon.com/cloudfront/): A distribution to route incoming requests to the S3 bucket to serve the static assets for the app.

- [S3](https://aws.amazon.com/s3/):
  - A bucket to store the client files and static assets of the build with optimized cache settings.
  - A bucket to store the CloudFront access logs for analysis via Athena. Only created if `enableAccessLogsAnalysis` is set to `true`.

- [Route53](https://aws.amazon.com/route53/): Two DNS records (`A` for IPv4 and `AAAA` for IPv6) in the configured hosted zone to make the app available on the internet via the configured custom domain.


- [Lambda](https://aws.amazon.com/lambda/):
    - A Lambda function that deletes the outdated static assets of the Nuxt app from S3.

- [EventBridge](https://aws.amazon.com/eventbridge/):
    - A scheduled rule to trigger the cleanup Lambda function for deleting the outdated static assets of the Nuxt app from S3 every tuesday at 03:30 AM GMT.

- [Athena](https://aws.amazon.com/athena/): A database and table to analyze the access logs of the Nuxt app's CloudFront distribution. Only created if `enableAccessLogsAnalysis` is set to `true`.

- AppConfig Application and Environment.

- CodeBuild Project, CodePipeline pipeline



## Useful commands
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
