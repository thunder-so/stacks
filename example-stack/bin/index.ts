#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { ExampleStack, type ExampleProps } from "../index";

const appStackProps: ExampleProps = {
  env: {
    account: process.env.ACCOUNT_ID,
    region: process.env.ENVIRONMENT_REGION
  },
  application: process.env.APPLICATION,
  service: process.env.SERVICE,
  environment: process.env.ENVIRONMENT,

  // all resources created in the stack will be tagged
  tags: {
    test: 'value'
  },
};

new ExampleStack(new App(), `${appStackProps.application}-${appStackProps.service}-${appStackProps.environment}-stack`, appStackProps);