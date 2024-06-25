#!/usr/bin/env node
import {App} from "aws-cdk-lib";
import {StaticSiteStack, type StaticSiteStackProps} from "@thunderso/stacks/static-site/lib";

const appStackProps: StaticSiteStackProps = {
    /**
     * The AWS environment (account/region) where this stack will be deployed.
     */
    env: {
        // The ID of your AWS account on which to deploy the stack.
        account: '',

        // The AWS region where to deploy the app.
        region: 'us-east-1'
    },

    /**
     * A string identifier for the project the app is part of.
     * A project might have multiple different services.
     */
    application: '',

    /**
     * A string identifier for the project's service the app is created for.
     * This can be seen as the name of the app.
     */
    service: '',

    /**
     * A string to identify the environment of the app. This enables us
     * to deploy multiple different environments of the same app, e.g., production and development.
     */
    environment: '',

    /**
     * Stack tags that will be applied to all the taggable resources and the stack itself.
     */
    // tags: {
    //     key: 'value'
    // },
}

new StaticSiteStack(new App(), `${appStackProps.project}-${appStackProps.service}-${appStackProps.environment}-stack`, appStackProps);