# Static Site Generators on AWS S3 and CloudFront

This is a TypeScript CDK project which provisions infrastructure.

Create an `.env` file in the root directory.

```sh
ACCOUNT=YOUR_AWS_ACCOUNT_ID
REGION=us-east-1
APPLICATION_NAME=mogambo
ENVIRONMENT_NAME=preview

SOURCE_OWNER=vuejs
SOURCE_REPO=vitepress 
SOURCE_BRANCH_OR_REF=main 

BUILD_RUNTIME=nodejs18.x 
BUILD_INSTALLCMD=npm install
BUILD_BUILDCMD=npm run build:docs 
BUILD_OUTPUTDIR=docs/.vitepress/dist
```

Make sure the Github repository is public.

## CDK commands

* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template