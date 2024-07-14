import {type StackProps} from "aws-cdk-lib";

export interface StaticSiteProps extends StackProps {
    /**
     * The AWS environment (account/region) where this stack will be deployed.
     */
    readonly env: {
      // The ID of your AWS account on which to deploy the stack.
      account: string;
  
      // The AWS region where to deploy the app.
      region: string;
    };
  
    /**
     * A string identifier for the project the app is part of.
     */
    readonly application: string;
  
    /**
     * A string identifier for the project's service the app is created for.
     */
    readonly service: string;
  
    /**
     * A string to identify the environment of the app.
     */
    readonly environment: string;
  
    /**
     * Configure your Github repository
     */
    readonly sourceProps: {
      owner: string;
      repo: string;
      branchOrRef: string;
      rootdir?: string;
    };

    /**
     * Provide the ARN to your Secrets Manager secret.
     */
    readonly githubAccessTokenArn: string;
  
    /**
     * If you have a custom buildspec.yml file for your app, provide the relative path to the file.
     */
    readonly buildSpecFilePath?: string;
  
    /**
     * If you provide a buildSpec file, skip this.
     */
    readonly buildProps?: {
      runtime: number;
      installcmd: string;
      buildcmd: string;
      outputDir: string;
    };
   
    /**
     * Optional. The domain (without the protocol) at which the app shall be publicly available.
     */
    readonly domain?: string;
  
    /**
     * Optional. The ARN of the certificate to use on CloudFront for the app to make it accessible via HTTPS.
     */
    readonly globalCertificateArn?: string;
  
    /**
     * Optional. The ID of the hosted zone to create a DNS record for the specified domain.
     */
    readonly hostedZoneId?: string;
  
    /**
     * Optional. If you have a custom CloudFront Functions file for your app, provide the relative path to the file.
     */
    readonly cfFunctionFilePath?: string;
    
    /**
     * Optional. Whether to provision Athena for CloudFront access logs analysis.
     */
    readonly enableAccessLogAnalysis?: boolean;
  
    /**
     * Optional. Whether to provision Lambda and EventBridge rule to cleanup stale static assets.
     */
    readonly enableAssetCleanup?: boolean;


}
  