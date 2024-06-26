# Thunder Stacks: Constructs

Thunder provides ready to use AWS CDK L3 constructs to use with your projects. 

## ApplicationConstruct

Resources created:
- AWS::AppConfig::Application

## EnvironmentConstruct

Resources created:
- AWS::IAM::Role as EnvironmentConstructAppConfigRetrievalRole
- AWS::AppConfig::Environment
- AWS::AppConfig::ConfigurationProfile

## HostingConstruct

Resources created:
AWS::S3::Bucket as HostingBucketLogsBucket
AWS::S3::Bucket as HostingBucket
AWS::S3::Bucket as AccessLogsBucket
AWS::CloudFront::Distribution
AWS::Route53::RecordSet (if domain and globalCertificateArn are provided):
A record for IPv4
AAAA record for IPv6

## PipelineConstruct

Resources created:
AWS::S3::Bucket as BuildOutputBucket
AWS::Lambda::Function as SyncBucketsFunction
AWS::CodeBuild::Project as CodeBuildProject
AWS::S3::Bucket as BuildLogsBucket
AWS::S3::Bucket as ArtifactBucket
AWS::CodePipeline::Pipeline as Pipeline
AWS::CodePipeline::GitHubSourceAction
AWS::CodePipeline::CodeBuildAction
AWS::CodePipeline::S3DeployAction
AWS::CodePipeline::LambdaInvokeAction