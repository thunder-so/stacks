import { Aws, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Construct } from "constructs";
import { Bucket, type IBucket, BlockPublicAccess, ObjectOwnership, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { HttpOrigin, S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Distribution, type IDistribution, CachePolicy, SecurityPolicyProtocol, HttpVersion, PriceClass, ResponseHeadersPolicy, HeadersFrameOption, HeadersReferrerPolicy, BehaviorOptions, AllowedMethods, ViewerProtocolPolicy, CacheCookieBehavior, CacheHeaderBehavior, CacheQueryStringBehavior, KeyValueStore } from "aws-cdk-lib/aws-cloudfront";
import { AaaaRecord, ARecord, HostedZone, type IHostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

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
     * The cloudfront key-value store where we keep the commit hash
     */
    // private kv: KeyValueStore;


    constructor(scope: Construct, id: string, props: HostingProps) {
        super(scope, id)

        // this.kv = this.createKV(props);
        this.hostingBucket = this.createHostingBucket(props);
        this.distribution = this.createCloudfrontDistribution(props);

        if(props.domain) {
            this.createDnsRecords(props);
        }

        if (props.enableAnalytics) {

        }

    }

    // private createKV(props: HostingProps): KeyValueStore {
    //     return new KeyValueStore(this, `kv`, {
    //         keyValueStoreName: `${props.application}-${props.service}-${props.environment}-kv`
    //     });
    // }

    /**
     * Creates the bucket to store the static deployment asset files of your site.
     *
     * @private
     */
    private createHostingBucket(props: HostingProps): IBucket {
        const bucketNamePrefix = `${props.application}-${props.service}-${props.environment}`;

        // Hosting bucket access log bucket
        const hostingLogsBucket = new Bucket(this, "HostingBucketLogsBucket", {
            bucketName: `${bucketNamePrefix}-hosting-logs`,
            encryption: BucketEncryption.S3_MANAGED,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            enforceSSL: true,
            removalPolicy: RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });

        // primary hosting bucket
        const bucket = new Bucket(this, "HostingBucket", {
            bucketName: `${bucketNamePrefix}-hosting`,
            versioned: false,
            serverAccessLogsBucket: hostingLogsBucket,
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

        return bucket;
    }

    /**
     * Create the primary cloudfront distribution
     * @param props 
     * @private
     */
    private createCloudfrontDistribution(props: HostingProps): IDistribution {
        const bucketNamePrefix = `${props.application}-${props.service}-${props.environment}`;

        // access logs bucket
        const accessLogsBucket = new Bucket(this, "AccessLogsBucket", {
            bucketName: `${bucketNamePrefix}-access-logs`,
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
          // functionAssociations: [
          //   {
          //     function: params.changeUri,
          //     eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          //   },
          // ],
      };

      // imgBehaviour
      const imgBehaviour: BehaviorOptions = {
        origin: this.s3Origin,
        responseHeadersPolicy: responseHeadersPolicy,
        cachePolicy: imgCachePolicy,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // functionAssociations: [
        //   {
        //     function: params.changeUri,
        //     eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        //   },
        // ],
      };

      // staticAssetsBehaviour
      const staticAssetsBehaviour: BehaviorOptions = {
        origin: this.s3Origin,
        compress: true,
        responseHeadersPolicy: responseHeadersPolicy,
        cachePolicy: staticAssetsCachePolicy,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // functionAssociations: [
        //   {
        //     function: params.changeUri,
        //     eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        //   },
        // ],
      };

        // finally, create distribution
        const distributionName = `${props.application}-${props.service}-${props.environment}-cdn`;

        return new Distribution(this, distributionName, {
            comment: "Stack name: " + Aws.STACK_NAME,
            defaultRootObject: "index.html",
            httpVersion: HttpVersion.HTTP2_AND_3,
            ...(accessLogsBucket ? { enableLogging: true } : {}),
            ...(accessLogsBucket ? { logBucket: accessLogsBucket } : {}),
            ...(accessLogsBucket ? { logFilePrefix: `${distributionName}-logs` } : {}),
            minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
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
            ...(props.domain && props.globalCertificateArn
              ? {
                  domainNames: [props.domain],
                  certificate: Certificate.fromCertificateArn(this, `${props.service}-global-certificate`, props.globalCertificateArn),
                }
              : {}),
          });

    }

    /**
     * Resolves the hosted zone at which the DNS records shall be created to access the app on the internet.
     *
     * @param props
     * @private
     */
    private findHostedZone(props: HostingProps): IHostedZone {
        const domainParts = props.domain?.split('.');

        return HostedZone.fromHostedZoneAttributes(this, `${props.service}-hosted-zone`, {
            hostedZoneId: props.hostedZoneId,
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
            zone: hostedZone,
            target: dnsTarget,
        });

        // Create a record for IPv6
        new AaaaRecord(this, `${props.service}-ipv6-record`, {
            recordName: props.domain,
            zone: hostedZone,
            target: dnsTarget,
        });
    }

}