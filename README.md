# stacks
AWS CDK Stack templates



SsgStack: deploying... [1/1]
SsgStack: creating CloudFormation changeset...
SsgStack |  0/21 | 23:00:18 | CREATE_IN_PROGRESS   | AWS::AppConfig::Environment          | EnvironmentConstruct/AppConfigEnvironment-mogambo-preview (EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5)
SsgStack |  0/21 | 23:00:19 | CREATE_IN_PROGRESS   | AWS::AppConfig::Environment          | EnvironmentConstruct/AppConfigEnvironment-mogambo-preview (EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5) Resource creation Initiated
SsgStack |  1/21 | 23:00:20 | CREATE_COMPLETE      | AWS::AppConfig::Environment          | EnvironmentConstruct/AppConfigEnvironment-mogambo-preview (EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5)
SsgStack |  1/21 | 23:00:20 | CREATE_IN_PROGRESS   | AWS::CloudFront::Function            | CloudFrontToS3/SetHttpSecurityHeaders (CloudFrontToS3SetHttpSecurityHeaders9E6088E2) Resource creation Initiated
SsgStack |  2/21 | 23:00:20 | CREATE_COMPLETE      | AWS::CloudFront::Function            | CloudFrontToS3/SetHttpSecurityHeaders (CloudFrontToS3SetHttpSecurityHeaders9E6088E2)
SsgStack |  2/21 | 23:00:01 | REVIEW_IN_PROGRESS   | AWS::CloudFormation::Stack           | SsgStack User Initiated
SsgStack |  2/21 | 23:00:11 | CREATE_IN_PROGRESS   | AWS::CloudFormation::Stack           | SsgStack User Initiated
SsgStack |  2/21 | 23:00:15 | CREATE_IN_PROGRESS   | AWS::CDK::Metadata                   | CDKMetadata/Default (CDKMetadata)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::AppConfig::Application          | ApplicationConstruct/AppConfigApplication-mogambo (ApplicationConstructAppConfigApplicationmogamboCB36EF43)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::S3::Bucket                      | CloudFrontToS3/S3LoggingBucket (CloudFrontToS3S3LoggingBucketEF5CD8B2)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::IAM::Role                       | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview (EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::CloudFront::OriginAccessControl | CloudFrontToS3/CloudFrontOac (CloudFrontToS3CloudFrontOacFB5D4E73)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::CloudFront::Function            | CloudFrontToS3/SetHttpSecurityHeaders (CloudFrontToS3SetHttpSecurityHeaders9E6088E2)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::IAM::Role                       | PipelineConstruct/CodeBuildRole-mogambo-preview (PipelineConstructCodeBuildRolemogambopreview29A483FE)
SsgStack |  2/21 | 23:00:16 | CREATE_IN_PROGRESS   | AWS::S3::Bucket                      | CloudFrontToS3/CloudfrontLoggingBucketAccessLog (CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05)
SsgStack |  2/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::IAM::Role                       | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview (EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0) Resource creation Initiated
SsgStack |  2/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::AppConfig::Application          | ApplicationConstruct/AppConfigApplication-mogambo (ApplicationConstructAppConfigApplicationmogamboCB36EF43) Resource creation Initiated
SsgStack |  2/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::CDK::Metadata                   | CDKMetadata/Default (CDKMetadata) Resource creation Initiated
SsgStack |  3/21 | 23:00:17 | CREATE_COMPLETE      | AWS::CDK::Metadata                   | CDKMetadata/Default (CDKMetadata)
SsgStack |  3/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::IAM::Role                       | PipelineConstruct/CodeBuildRole-mogambo-preview (PipelineConstructCodeBuildRolemogambopreview29A483FE) Resource creation Initiated
SsgStack |  4/21 | 23:00:17 | CREATE_COMPLETE      | AWS::AppConfig::Application          | ApplicationConstruct/AppConfigApplication-mogambo (ApplicationConstructAppConfigApplicationmogamboCB36EF43)
SsgStack |  4/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::CloudFront::OriginAccessControl | CloudFrontToS3/CloudFrontOac (CloudFrontToS3CloudFrontOacFB5D4E73) Resource creation Initiated
SsgStack |  4/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::S3::Bucket                      | CloudFrontToS3/S3LoggingBucket (CloudFrontToS3S3LoggingBucketEF5CD8B2) Resource creation Initiated
SsgStack |  5/21 | 23:00:17 | CREATE_COMPLETE      | AWS::CloudFront::OriginAccessControl | CloudFrontToS3/CloudFrontOac (CloudFrontToS3CloudFrontOacFB5D4E73)
SsgStack |  5/21 | 23:00:17 | CREATE_IN_PROGRESS   | AWS::S3::Bucket                      | CloudFrontToS3/CloudfrontLoggingBucketAccessLog (CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05) Resource creation Initiated
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::IAM::Policy                     | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy (EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B)
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::CDK::Metadata                   | CDKMetadata/Default (CDKMetadata)
SsgStack |  5/21 | 23:00:39 | DELETE_SKIPPED       | AWS::S3::Bucket                      | CloudFrontToS3/CloudfrontLoggingBucketAccessLog (CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05)
SsgStack |  5/21 | 23:00:39 | DELETE_SKIPPED       | AWS::S3::Bucket                      | CloudFrontToS3/S3LoggingBucket (CloudFrontToS3S3LoggingBucketEF5CD8B2)
SsgStack |  4/21 | 23:00:40 | DELETE_COMPLETE      | AWS::AppConfig::Environment          | EnvironmentConstruct/AppConfigEnvironment-mogambo-preview (EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5)
SsgStack |  5/21 | 23:00:40 | DELETE_COMPLETE      | AWS::IAM::Policy                     | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy (EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B)
SsgStack |  4/21 | 23:00:40 | DELETE_COMPLETE      | AWS::CloudFront::OriginAccessControl | CloudFrontToS3/CloudFrontOac (CloudFrontToS3CloudFrontOacFB5D4E73)
SsgStack |  3/21 | 23:00:40 | DELETE_COMPLETE      | AWS::CDK::Metadata                   | CDKMetadata/Default (CDKMetadata)
SsgStack |  4/21 | 23:00:33 | CREATE_COMPLETE      | AWS::IAM::Role                       | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview (EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0)
SsgStack |  4/21 | 23:00:34 | CREATE_IN_PROGRESS   | AWS::IAM::Policy                     | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy (EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B)
SsgStack |  4/21 | 23:00:34 | CREATE_IN_PROGRESS   | AWS::AppConfig::ConfigurationProfile | EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview (EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC)
SsgStack |  5/21 | 23:00:35 | CREATE_COMPLETE      | AWS::IAM::Role                       | PipelineConstruct/CodeBuildRole-mogambo-preview (PipelineConstructCodeBuildRolemogambopreview29A483FE)
SsgStack |  5/21 | 23:00:35 | CREATE_IN_PROGRESS   | AWS::IAM::Policy                     | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy (EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B) Resource creation Initiated
SsgStack |  5/21 | 23:00:35 | CREATE_FAILED        | AWS::AppConfig::ConfigurationProfile | EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview (EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC) Resource handler returned message: "1 validation error detected: Value arn:aws:iam::665186350589:role/SsgStack-EnvironmentConstructAppConfigRetrievalRole-j5KQ5jxSJU2s at 'retrievalRoleArn' failed to satisfy constraint: Member must be null if the request has the following uri: hosted (Service: AppConfig, Status Code: 400, Request ID: 722403ba-b9d1-4b28-bf13-6cad56507ee0)" (RequestToken: 1f6658be-54ca-875f-84d2-c4c570fd1031, HandlerErrorCode: InvalidRequest)
SsgStack |  5/21 | 23:00:36 | CREATE_FAILED        | AWS::S3::Bucket                      | CloudFrontToS3/CloudfrontLoggingBucketAccessLog (CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05) Resource creation cancelled
SsgStack |  5/21 | 23:00:36 | CREATE_FAILED        | AWS::IAM::Policy                     | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy (EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B) Resource creation cancelled
SsgStack |  5/21 | 23:00:36 | CREATE_FAILED        | AWS::S3::Bucket                      | CloudFrontToS3/S3LoggingBucket (CloudFrontToS3S3LoggingBucketEF5CD8B2) Resource creation cancelled
SsgStack |  5/21 | 23:00:36 | ROLLBACK_IN_PROGRESS | AWS::CloudFormation::Stack           | SsgStack The following resource(s) failed to create: [EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC, CloudFrontToS3S3LoggingBucketEF5CD8B2, CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05, EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B]. Rollback requested by user.
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::CloudFront::OriginAccessControl | CloudFrontToS3/CloudFrontOac (CloudFrontToS3CloudFrontOacFB5D4E73)
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::IAM::Role                       | PipelineConstruct/CodeBuildRole-mogambo-preview (PipelineConstructCodeBuildRolemogambopreview29A483FE)
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::AppConfig::Environment          | EnvironmentConstruct/AppConfigEnvironment-mogambo-preview (EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5)
SsgStack |  5/21 | 23:00:39 | DELETE_IN_PROGRESS   | AWS::CloudFront::Function            | CloudFrontToS3/SetHttpSecurityHeaders (CloudFrontToS3SetHttpSecurityHeaders9E6088E2)
SsgStack |  4/21 | 23:00:42 | DELETE_COMPLETE      | AWS::CloudFront::Function            | CloudFrontToS3/SetHttpSecurityHeaders (CloudFrontToS3SetHttpSecurityHeaders9E6088E2)
SsgStack |  3/21 | 23:00:51 | DELETE_COMPLETE      | AWS::IAM::Role                       | PipelineConstruct/CodeBuildRole-mogambo-preview (PipelineConstructCodeBuildRolemogambopreview29A483FE)
 3/21 Currently in progress: SsgStack, CloudFrontToS3CloudFrontOacFB5D4E73, EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5
SsgStack |  4/21 | 23:03:06 | DELETE_COMPLETE      | AWS::AppConfig::ConfigurationProfile | EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview (EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC)
SsgStack |  4/21 | 23:03:07 | DELETE_IN_PROGRESS   | AWS::AppConfig::Application          | ApplicationConstruct/AppConfigApplication-mogambo (ApplicationConstructAppConfigApplicationmogamboCB36EF43)
SsgStack |  4/21 | 23:03:07 | DELETE_IN_PROGRESS   | AWS::IAM::Role                       | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview (EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0)
SsgStack |  3/21 | 23:03:08 | DELETE_COMPLETE      | AWS::AppConfig::Application          | ApplicationConstruct/AppConfigApplication-mogambo (ApplicationConstructAppConfigApplicationmogamboCB36EF43)
SsgStack |  2/21 | 23:03:19 | DELETE_COMPLETE      | AWS::IAM::Role                       | EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview (EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0)
SsgStack |  3/21 | 23:03:20 | ROLLBACK_COMPLETE    | AWS::CloudFormation::Stack           | SsgStack

Failed resources:
SsgStack | 23:00:35 | CREATE_FAILED        | AWS::AppConfig::ConfigurationProfile | EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview (EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC) Resource handler returned message: "1 validation error detected: Value arn:aws:iam::665186350589:role/SsgStack-EnvironmentConstructAppConfigRetrievalRole-j5KQ5jxSJU2s at 'retrievalRoleArn' failed to satisfy constraint: Member must be null if the request has the following uri: hosted (Service: AppConfig, Status Code: 400, Request ID: 722403ba-b9d1-4b28-bf13-6cad56507ee0)" (RequestToken: 1f6658be-54ca-875f-84d2-c4c570fd1031, HandlerErrorCode: InvalidRequest)

 ❌  SsgStack failed: Error: The stack named SsgStack failed creation, it may need to be manually deleted from the AWS console: ROLLBACK_COMPLETE: Resource handler returned message: "1 validation error detected: Value arn:aws:iam::6651863 50589:role/SsgStack-EnvironmentConstructAppConfigRetrievalRole-j5KQ5jxSJU2s at 'retrievalRoleArn' failed to satisfy constraint: Member must be null if the request has the following uri: hosted (Service: AppConfig, Status Code: 400, Request ID: 722403ba-b9d1-4b28-bf13-6cad56507ee0)" (RequestToken: 1f6658be-54ca-875f-84d2-c4c570fd1031, HandlerErrorCode: InvalidRequest)
    at FullCloudFormationDeployment.monitorDeployment (C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:430:10615)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Object.deployStack2 [as deployStack] (C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:433:198753)
    at async C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:433:180693

 ❌ Deployment failed: Error: The stack named SsgStack failed creation, it may need to be manually deleted from the AWS console: ROLLBACK_COMPLETE: Resource handler returned message: "1 validation error detected: Value arn:aws:iam::665186 350589:role/SsgStack-EnvironmentConstructAppConfigRetrievalRole-j5KQ5jxSJU2s at 'retrievalRoleArn' failed to satisfy constraint: Member must be null if the request has the following uri: hosted (Service: AppConfig, Status Code: 400, Request ID: 722403ba-b9d1-4b28-bf13-6cad56507ee0)" (RequestToken: 1f6658be-54ca-875f-84d2-c4c570fd1031, HandlerErrorCode: InvalidRequest)
    at FullCloudFormationDeployment.monitorDeployment (C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:430:10615)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Object.deployStack2 [as deployStack] (C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:433:198753)
    at async C:\Users\sadda\Documents\www\thunder\stacks\ssg\node_modules\aws-cdk\lib\index.js:433:180693

The stack named SsgStack failed creation, it may need to be manually deleted from the AWS console: ROLLBACK_COMPLETE: Resource handler returned message: "1 validation error detected: Value arn:aws:iam::665186350589:role/SsgStack-EnvironmentConstructAppConfigRetrievalRole-j5KQ5jxSJU2s at 'retrievalRoleArn' failed to satisfy constraint: Member must be null if the request has the following uri: hosted (Service: AppConfig, Status Code: 400, Request ID: 722403ba-b9d1-4b28-bf13-6cad56507ee0)" (RequestToken: 1f6658be-54ca-875f-84d2-c4c570fd1031, HandlerErrorCode: InvalidRequest)