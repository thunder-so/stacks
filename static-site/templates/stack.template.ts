#!/usr/bin/env node
import {App} from "aws-cdk-lib";
import {StaticSiteStack, type StaticSiteStackProps} from "@thunderso/stacks/static-site";

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
     * The domain (without the protocol) at which the app shall be publicly available.
     * A DNS record will be automatically created in Route53 for the domain.
     * This also supports subdomains.
     * Examples: "example.com", "sub.example.com"
     */
    domain: '',

    /**
     * The ARN of the certificate to use on CloudFront for the app to make it accessible via HTTPS.
     * The certificate must be issued for the specified domain in us-east-1 (global) regardless of the
     * region specified via 'env.region' as CloudFront only works globally.
     */
    globalTlsCertificateArn: '',

    /**
     * The id of the hosted zone to create a DNS record for the specified domain.
     */
    hostedZoneId: '',

    /**
     * The number of days to retain static assets of outdated deployments in the S3 bucket.
     * Useful to allow users to still access old assets after a new deployment when they are still browsing on an old version.
     * Defaults to 30 days.
     */
    outdatedAssetsRetentionDays: 30,

    /**
     * Stack tags that will be applied to all the taggable resources and the stack itself.
     */
    tags: {
        key: 'value'
    },
}

new StaticSiteStack(new App(), `${appStackProps.project}-${appStackProps.service}-${appStackProps.environment}-stack`, appStackProps);