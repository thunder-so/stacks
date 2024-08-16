import fs from 'fs';
import { Aws, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Bucket, type IBucket, BlockPublicAccess, ObjectOwnership, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { PolicyStatement, Effect, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { CfnDistribution, Distribution, type IDistribution, CachePolicy, SecurityPolicyProtocol, HttpVersion, PriceClass, ResponseHeadersPolicy, HeadersFrameOption, HeadersReferrerPolicy, BehaviorOptions, AllowedMethods, ViewerProtocolPolicy, CacheCookieBehavior, CacheHeaderBehavior, CacheQueryStringBehavior, CfnOriginAccessControl, Function as CloudFrontFunction, FunctionCode as CloudFrontFunctionCode, FunctionEventType } from "aws-cdk-lib/aws-cloudfront";
import { AaaaRecord, ARecord, HostedZone, type IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { createCloudFrontDistributionForS3, CreateCloudFrontDistributionForS3Props, CreateCloudFrontDistributionForS3Response } from '@aws-solutions-constructs/core'

export interface HostingProps {
    application: string;
    service: string;
    environment: string;
    edgeFunctionFilePath?: string;
    domain?: string;
    globalCertificateArn?: string;
    hostedZoneId?: string;
    enableAnalytics?: boolean;
}

export class HostingConstruct extends Construct {

    public resourceIdPrefix: string;

    /**
     * The S3 bucket where the deployment assets gets stored.
     */
    public hostingBucket: IBucket;

    /**
     * The S3 bucket where the access logs of the CloudFront distribution gets stored.
     */
    public accessLogsBucket: IBucket|undefined;

    /**
     * The CloudFront distribution.
     */
    public distribution:  IDistribution;

    /**
     * The CloudFront distribution origin that routes to S3 HTTP server.
     */
    private s3Origin: S3Origin;

    /**
     * The CloudFront Edge Function
     */
    private cloudFrontFunction: CloudFrontFunction
    

    constructor(scope: Construct, id: string, props: HostingProps) {
      super(scope, id);

      this.resourceIdPrefix = `${props.application}-${props.service}-${props.environment}`;

      // this.kv = this.createKV(props);
      this.createHostingBucket(props);

      if (props.edgeFunctionFilePath) {
        this.cloudFrontFunction = this.createCloudFrontFunction(props);
      }
      
      this.createCloudfrontDistribution(props);

      if(props.domain) {
        this.createDnsRecords(props);
      }

      if (props.enableAnalytics) {

      }
    }

    private createCloudFrontFunction(props: HostingProps): CloudFrontFunction {
      const cloudFrontFunctionCode = fs.readFileSync(props.edgeFunctionFilePath as string, "utf8");

      const cloudFrontFunction = new CloudFrontFunction(this, 'CloudFrontFunction', {
        code: CloudFrontFunctionCode.fromInline(cloudFrontFunctionCode),
        comment: `CloudFront Function: ${props.edgeFunctionFilePath}`,
      });

      return cloudFrontFunction;
    }

    /**
     * Creates the bucket to store the static deployment asset files of your site.
     *
     * @private
     */
    private createHostingBucket(props: HostingProps) {

        // Hosting bucket access log bucket
        const originLogsBucket = new Bucket(this, "OriginLogsBucket", {
            bucketName: `${this.resourceIdPrefix}-origin-logs`,
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            enforceSSL: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // primary hosting bucket
        const bucket = new Bucket(this, "HostingBucket", {
            bucketName: `${this.resourceIdPrefix}-hosting`,
            versioned: true,
            serverAccessLogsBucket: originLogsBucket,
            enforceSSL: true,
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: new BlockPublicAccess({
              blockPublicPolicy: true,
              blockPublicAcls: true,
              ignorePublicAcls: true,
              restrictPublicBuckets: true,
            }),
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // Setting the origin to HTTP server
        this.s3Origin = new S3Origin(bucket);

        this.hostingBucket = bucket;
    }

    /**
     * Create the primary cloudfront distribution
     * @param props 
     * @private
     */
    private createCloudfrontDistribution(props: HostingProps) {

        // access logs bucket
        const accessLogsBucket = new Bucket(this, "AccessLogsBucket", {
            bucketName: `${this.resourceIdPrefix}-access-logs`,
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            enforceSSL: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        this.accessLogsBucket = accessLogsBucket;

        // defaultCachePolicy
        const defaultCachePolicy = new CachePolicy(this, "DefaultCachePolicy", {
          cachePolicyName: "CachePolicy" + Aws.STACK_NAME + "-" + Aws.REGION,
          comment: "Default policy - " + Aws.STACK_NAME + "-" + Aws.REGION,
          defaultTtl: Duration.days(365),
          minTtl: Duration.days(365),
          maxTtl: Duration.days(365),
          cookieBehavior: CacheCookieBehavior.none(),
          headerBehavior: CacheHeaderBehavior.none(),
          queryStringBehavior: CacheQueryStringBehavior.none(),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
        });
        
        // imgCachePolicy
        const imgCachePolicy = new CachePolicy(this, "ImagesCachePolicy", {
          cachePolicyName: "ImagesCachePolicy" + Aws.STACK_NAME + "-" + Aws.REGION,
          comment: "Images cache policy - " + Aws.STACK_NAME + "-" + Aws.REGION,
          defaultTtl: Duration.days(365),
          minTtl: Duration.days(365),
          maxTtl: Duration.days(365),
          cookieBehavior: CacheCookieBehavior.none(),
          headerBehavior: CacheHeaderBehavior.none(),
          queryStringBehavior: CacheQueryStringBehavior.none(),
        });
        
        // staticAssetsCachePolicy
        const staticAssetsCachePolicy = new CachePolicy(this, "staticAssetsCachePolicy", {
          cachePolicyName: "StaticAssetsCachePolicy" + Aws.STACK_NAME + "-" + Aws.REGION,
          comment: "Static assets cache policy - " + Aws.STACK_NAME + "-" + Aws.REGION,
          defaultTtl: Duration.days(365),
          minTtl: Duration.days(365),
          maxTtl: Duration.days(365),
          cookieBehavior: CacheCookieBehavior.none(),
          headerBehavior: CacheHeaderBehavior.none(),
          queryStringBehavior: CacheQueryStringBehavior.none(),
        });

        // ResponseHeadersPolicy
        const responseHeadersPolicy = new ResponseHeadersPolicy(this, "ResponseHeadersPolicy", {
            responseHeadersPolicyName: "ResponseHeadersPolicy" + Aws.STACK_NAME + "-" + Aws.REGION,
            comment: "ResponseHeadersPolicy" + Aws.STACK_NAME + "-" + Aws.REGION,
            securityHeadersBehavior: {
              contentTypeOptions: { override: true },
              frameOptions: {
                frameOption: HeadersFrameOption.DENY,
                override: true,
              },
              referrerPolicy: {
                referrerPolicy:
                  HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
                override: false,
              },
              strictTransportSecurity: {
                accessControlMaxAge: Duration.seconds(31536000),
                includeSubdomains: true,
                override: true,
              },
              xssProtection: { protection: true, modeBlock: true, override: true },
              
            },
            removeHeaders: ['age' , 'date'],
      });
      
      // defaultBehavior
      const defaultBehavior: BehaviorOptions = {
          origin: this.s3Origin,
          responseHeadersPolicy: responseHeadersPolicy,
          cachePolicy: defaultCachePolicy,
          allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          ...(this.cloudFrontFunction ? {
            functionAssociations: [{
                eventType: FunctionEventType.VIEWER_REQUEST,
                function: this.cloudFrontFunction
            }]
          } : {})
      };

      // imgBehaviour
      const imgBehaviour: BehaviorOptions = {
        origin: this.s3Origin,
        responseHeadersPolicy: responseHeadersPolicy,
        cachePolicy: imgCachePolicy,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      };

      // staticAssetsBehaviour
      const staticAssetsBehaviour: BehaviorOptions = {
        origin: this.s3Origin,
        compress: true,
        responseHeadersPolicy: responseHeadersPolicy,
        cachePolicy: staticAssetsCachePolicy,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      };

      // const oac = new CfnOriginAccessControl(this, "OAC", {
      //   originAccessControlConfig: {
      //     name: "OAC" + "-" + Aws.STACK_NAME + "-" + Aws.REGION,
      //     originAccessControlOriginType: "s3",
      //     signingBehavior: "always",
      //     signingProtocol: "sigv4",
      //   },
      // });

        // finally, create distribution
        const distributionName = `${this.resourceIdPrefix}-cdn`;

        const distributionProps = {
          comment: "Stack name: " + Aws.STACK_NAME,
          enableLogging: true,
          logBucket: this.accessLogsBucket,
          defaultBehavior: defaultBehavior,
          additionalBehaviors: {
            "*.jpg": imgBehaviour,
            "*.jpeg": imgBehaviour,
            "*.png": imgBehaviour,
            "*.gif": imgBehaviour,
            "*.bmp": imgBehaviour,
            "*.tiff": imgBehaviour,
            "*.ico": imgBehaviour,
            "*.js": staticAssetsBehaviour,
            "*.css": staticAssetsBehaviour,
            "*.html": staticAssetsBehaviour,
          },
          responseHeadersPolicy: responseHeadersPolicy,
          httpVersion: HttpVersion.HTTP2_AND_3,
          minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
          defaultRootObject: "index.html",
          errorResponses: [
            {
              httpStatus: 403,
              responseHttpStatus: 200,
              responsePagePath: '/index.html',
            }
          ],
          ...(props.domain && props.globalCertificateArn
            ? {
                domainNames: [props.domain],
                certificate: Certificate.fromCertificateArn(this, `${props.service}-global-certificate`, props.globalCertificateArn),
              }
            : {}),
        }

        // this.distribution = new Distribution(this, distributionName, distributionProps);

        // Define the CloudFront distribution using `createCloudFrontDistributionForS3`
        const cloudFrontDistributionProps: CreateCloudFrontDistributionForS3Props = {
          sourceBucket: this.hostingBucket,
          cloudFrontDistributionProps: distributionProps,
          httpSecurityHeaders: true
        };

        // Creating CloudFront distribution
        const cloudFrontDistributionForS3Response: CreateCloudFrontDistributionForS3Response = createCloudFrontDistributionForS3(this, distributionName, cloudFrontDistributionProps);

        this.distribution = cloudFrontDistributionForS3Response.distribution;

        // Attach the OriginAccessControl to the CloudFront Distribution, and remove the OriginAccessIdentity
        // const l1CloudFrontDistribution = this.distribution.node.defaultChild as CfnDistribution;
        // l1CloudFrontDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', cloudFrontDistributionForS3Response.originAccessControl?.attrId);

        // Grant CloudFront permission to get the objects from the s3 bucket origin
        this.hostingBucket.addToResourcePolicy(
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:GetObject'], // 's3:ListBucket' slows down deployment
            principals: [new ServicePrincipal('cloudfront.amazonaws.com')],
            resources: [`${this.hostingBucket.bucketArn}/*`],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': `arn:aws:cloudfront::${Aws.ACCOUNT_ID}:distribution/${this.distribution.distributionId}`
              }
            }
          })
        );
    }

    /**
     * Resolves the hosted zone at which the DNS records shall be created to access the app on the internet.
     *
     * @param props
     * @private
     */
    private findHostedZone(props: HostingProps): IHostedZone | void {
        const domainParts = props.domain?.split('.');
        if (!domainParts) return;

        return HostedZone.fromHostedZoneAttributes(this, `${props.service}-hosted-zone`, {
            hostedZoneId: props.hostedZoneId as string,
            zoneName: domainParts[domainParts.length - 1] // Support subdomains
        });
    }

    /**
     * Creates the DNS records to access the app on the internet via the custom domain.
     *
     * @param props
     * @private
     */
    private createDnsRecords(props: HostingProps): void {
        const hostedZone = this.findHostedZone(props);
        const dnsTarget = RecordTarget.fromAlias(new CloudFrontTarget(this.distribution));

        // Create a record for IPv4
        new ARecord(this, `${props.service}-ipv4-record`, {
            recordName: props.domain,
            zone: hostedZone as IHostedZone,
            target: dnsTarget,
        });

        // Create a record for IPv6
        new AaaaRecord(this, `${props.service}-ipv6-record`, {
            recordName: props.domain,
            zone: hostedZone as IHostedZone,
            target: dnsTarget,
        });
    }

}