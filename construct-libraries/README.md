# Example `cdk synth`

## ApplicationConstruct

```yaml
Outputs:
  ApplicationConstructName:
    Value: test
Resources:
  ApplicationConstructAppConfigApplication285715C3:
    Type: AWS::AppConfig::Application
    Properties:
      Description: AppConfig Application for name
      Name: name
    Metadata:
      aws:cdk:path: SsgStack/ApplicationConstruct/AppConfigApplication
```

## EnvironmentConstruct

```yaml
Resources:
  ApplicationConstructAppConfigApplicationmogamboCB36EF43:
    Type: AWS::AppConfig::Application
    Properties:
      Description: AppConfig Application for mogambo
      Name: mogambo
    Metadata:
      aws:cdk:path: SsgStack/ApplicationConstruct/AppConfigApplication-mogambo
  EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: appconfig.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/Resource
  EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: ssm:GetParameters
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B
      Roles:
        - Ref: EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy/Resource
  EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5:
    Type: AWS::AppConfig::Environment
    Properties:
      ApplicationId:
        Ref: ApplicationConstructAppConfigApplicationmogamboCB36EF43
      Name: preview
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigEnvironment-mogambo-preview
  EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC:
    Type: AWS::AppConfig::ConfigurationProfile
    Properties:
      ApplicationId:
        Ref: ApplicationConstructAppConfigApplicationmogamboCB36EF43
      LocationUri: hosted
      Name: preview-configuration-profile
      RetrievalRoleArn:
        Fn::GetAtt:
          - EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0
          - Arn
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview
```

## PipelineS3Construct

```yaml
Outputs:
  ApplicationConstructName:
    Value:
      Ref: ApplicationConstructAppConfigApplicationmogamboCB36EF43
  EnvironmentConstructName:
    Value:
      Ref: EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5
  PipelineConstructName:
    Value:
      Ref: PipelineConstructCodeBuildProjectmogambopreview478BC1FA
Resources:
  ApplicationConstructAppConfigApplicationmogamboCB36EF43:
    Type: AWS::AppConfig::Application
    Properties:
      Description: AppConfig Application for mogambo
      Name: mogambo
    Metadata:
      aws:cdk:path: SsgStack/ApplicationConstruct/AppConfigApplication-mogambo
  EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: appconfig.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/Resource
  EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: ssm:GetParameters
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: EnvironmentConstructAppConfigRetrievalRolemogambopreviewDefaultPolicy7359B04B
      Roles:
        - Ref: EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigRetrievalRole-mogambo-preview/DefaultPolicy/Resource
  EnvironmentConstructAppConfigEnvironmentmogambopreview3AF1E5E5:
    Type: AWS::AppConfig::Environment
    Properties:
      ApplicationId:
        Ref: ApplicationConstructAppConfigApplicationmogamboCB36EF43
      Name: preview
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigEnvironment-mogambo-preview
  EnvironmentConstructAppConfigConfigurationProfilemogambopreviewD2002FEC:
    Type: AWS::AppConfig::ConfigurationProfile
    Properties:
      ApplicationId:
        Ref: ApplicationConstructAppConfigApplicationmogamboCB36EF43
      LocationUri: hosted
      Name: preview-configuration-profile
      RetrievalRoleArn:
        Fn::GetAtt:
          - EnvironmentConstructAppConfigRetrievalRolemogambopreview3EDC3FC0
          - Arn
    Metadata:
      aws:cdk:path: SsgStack/EnvironmentConstruct/AppConfigConfigurationProfile-mogambo-preview
  CloudFrontToS3S3LoggingBucketEF5CD8B2:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      VersioningConfiguration:
        Status: Enabled
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/S3LoggingBucket/Resource
      cfn_nag:
        rules_to_suppress:
          - id: W35
            reason: This S3 bucket is used as the access logging bucket for another bucket
  CloudFrontToS3S3LoggingBucketPolicy360F3875:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: CloudFrontToS3S3LoggingBucketEF5CD8B2
      PolicyDocument:
        Statement:
          - Action: s3:*
            Condition:
              Bool:
                aws:SecureTransport: "false"
            Effect: Deny
            Principal:
              AWS: "*"
            Resource:
              - Fn::GetAtt:
                  - CloudFrontToS3S3LoggingBucketEF5CD8B2
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - CloudFrontToS3S3LoggingBucketEF5CD8B2
                        - Arn
                    - /*
          - Action: s3:PutObject
            Condition:
              ArnLike:
                aws:SourceArn:
                  Fn::GetAtt:
                    - CloudFrontToS3S3Bucket9CE6AB04
                    - Arn
              StringEquals:
                aws:SourceAccount:
                  Ref: AWS::AccountId
            Effect: Allow
            Principal:
              Service: logging.s3.amazonaws.com
            Resource:
              Fn::Join:
                - ""
                - - Fn::GetAtt:
                      - CloudFrontToS3S3LoggingBucketEF5CD8B2
                      - Arn
                  - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/S3LoggingBucket/Policy/Resource
  CloudFrontToS3S3Bucket9CE6AB04:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      LifecycleConfiguration:
        Rules:
          - NoncurrentVersionTransitions:
              - StorageClass: GLACIER
                TransitionInDays: 90
            Status: Enabled
      LoggingConfiguration:
        DestinationBucketName:
          Ref: CloudFrontToS3S3LoggingBucketEF5CD8B2
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      VersioningConfiguration:
        Status: Enabled
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/S3Bucket/Resource
  CloudFrontToS3S3BucketPolicy2495300D:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: CloudFrontToS3S3Bucket9CE6AB04
      PolicyDocument:
        Statement:
          - Action: s3:*
            Condition:
              Bool:
                aws:SecureTransport: "false"
            Effect: Deny
            Principal:
              AWS: "*"
            Resource:
              - Fn::GetAtt:
                  - CloudFrontToS3S3Bucket9CE6AB04
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - CloudFrontToS3S3Bucket9CE6AB04
                        - Arn
                    - /*
          - Action: s3:GetObject
            Condition:
              StringEquals:
                AWS:SourceArn:
                  Fn::Join:
                    - ""
                    - - "arn:aws:cloudfront::"
                      - Ref: AWS::AccountId
                      - :distribution/
                      - Ref: CloudFrontToS3CloudFrontDistribution241D9866
            Effect: Allow
            Principal:
              Service: cloudfront.amazonaws.com
            Resource:
              Fn::Join:
                - ""
                - - Fn::GetAtt:
                      - CloudFrontToS3S3Bucket9CE6AB04
                      - Arn
                  - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/S3Bucket/Policy/Resource
      cfn_nag:
        rules_to_suppress:
          - id: F16
            reason: Public website bucket policy requires a wildcard principal
  CloudFrontToS3SetHttpSecurityHeaders9E6088E2:
    Type: AWS::CloudFront::Function
    Properties:
      AutoPublish: true
      FunctionCode: "function handler(event) { var response = event.response; var headers = response.headers; headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload'}; headers['content-security-policy'] = { value: \"default-src 'none'; img-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'\"}; headers['x-content-type-options'] = { value: 'nosniff'}; headers['x-frame-options'] = {value: 'DENY'}; headers['x-xss-protection'] = {value: '1; mode=block'}; return response; }"
      FunctionConfig:
        Comment: SetHttpSecurityHeadersc8fc9a610c4c4844a05000584685b2b0b2b2ccb33b
        Runtime: cloudfront-js-1.0
      Name: SetHttpSecurityHeadersc8fc9a610c4c4844a05000584685b2b0b2b2ccb33b
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/SetHttpSecurityHeaders/Resource
  CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      OwnershipControls:
        Rules:
          - ObjectOwnership: ObjectWriter
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      VersioningConfiguration:
        Status: Enabled
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudfrontLoggingBucketAccessLog/Resource
      cfn_nag:
        rules_to_suppress:
          - id: W35
            reason: This S3 bucket is used as the access logging bucket for another bucket
  CloudFrontToS3CloudfrontLoggingBucketAccessLogPolicy2AAA13DA:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05
      PolicyDocument:
        Statement:
          - Action: s3:*
            Condition:
              Bool:
                aws:SecureTransport: "false"
            Effect: Deny
            Principal:
              AWS: "*"
            Resource:
              - Fn::GetAtt:
                  - CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05
                        - Arn
                    - /*
          - Action: s3:PutObject
            Condition:
              ArnLike:
                aws:SourceArn:
                  Fn::GetAtt:
                    - CloudFrontToS3CloudfrontLoggingBucket8350BE9B
                    - Arn
              StringEquals:
                aws:SourceAccount:
                  Ref: AWS::AccountId
            Effect: Allow
            Principal:
              Service: logging.s3.amazonaws.com
            Resource:
              Fn::Join:
                - ""
                - - Fn::GetAtt:
                      - CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05
                      - Arn
                  - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudfrontLoggingBucketAccessLog/Policy/Resource
  CloudFrontToS3CloudfrontLoggingBucket8350BE9B:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: LogDeliveryWrite
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      LoggingConfiguration:
        DestinationBucketName:
          Ref: CloudFrontToS3CloudfrontLoggingBucketAccessLog0E3BAD05
      OwnershipControls:
        Rules:
          - ObjectOwnership: ObjectWriter
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      VersioningConfiguration:
        Status: Enabled
    UpdateReplacePolicy: Retain
    DeletionPolicy: Retain
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudfrontLoggingBucket/Resource
  CloudFrontToS3CloudfrontLoggingBucketPolicy416B82D9:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: CloudFrontToS3CloudfrontLoggingBucket8350BE9B
      PolicyDocument:
        Statement:
          - Action: s3:*
            Condition:
              Bool:
                aws:SecureTransport: "false"
            Effect: Deny
            Principal:
              AWS: "*"
            Resource:
              - Fn::GetAtt:
                  - CloudFrontToS3CloudfrontLoggingBucket8350BE9B
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - CloudFrontToS3CloudfrontLoggingBucket8350BE9B
                        - Arn
                    - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudfrontLoggingBucket/Policy/Resource
  CloudFrontToS3CloudFrontOacFB5D4E73:
    Type: AWS::CloudFront::OriginAccessControl
    Properties:
      OriginAccessControlConfig:
        Description: Origin access control provisioned by aws-cloudfront-s3
        Name:
          Fn::Join:
            - ""
            - - aws-cloudfront-s3-CloutToS3-
              - Fn::Select:
                  - 2
                  - Fn::Split:
                      - /
                      - Ref: AWS::StackId
        OriginAccessControlOriginType: s3
        SigningBehavior: always
        SigningProtocol: sigv4
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudFrontOac
  CloudFrontToS3CloudFrontDistribution241D9866:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        DefaultCacheBehavior:
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
          Compress: true
          FunctionAssociations:
            - EventType: viewer-response
              FunctionARN:
                Fn::GetAtt:
                  - CloudFrontToS3SetHttpSecurityHeaders9E6088E2
                  - FunctionARN
          TargetOriginId: SsgStackCloudFrontToS3CloudFrontDistributionOrigin1C761EBDE
          ViewerProtocolPolicy: redirect-to-https
        DefaultRootObject: index.html
        Enabled: true
        HttpVersion: http2
        IPV6Enabled: true
        Logging:
          Bucket:
            Fn::GetAtt:
              - CloudFrontToS3CloudfrontLoggingBucket8350BE9B
              - RegionalDomainName
        Origins:
          - DomainName:
              Fn::GetAtt:
                - CloudFrontToS3S3Bucket9CE6AB04
                - RegionalDomainName
            Id: SsgStackCloudFrontToS3CloudFrontDistributionOrigin1C761EBDE
            OriginAccessControlId:
              Fn::GetAtt:
                - CloudFrontToS3CloudFrontOacFB5D4E73
                - Id
            S3OriginConfig:
              OriginAccessIdentity: ""
    Metadata:
      aws:cdk:path: SsgStack/CloudFrontToS3/CloudFrontDistribution/Resource
      cfn_nag:
        rules_to_suppress:
          - id: W70
            reason: Since the distribution uses the CloudFront domain name, CloudFront automatically sets the security policy to TLSv1 regardless of the value of MinimumProtocolVersion
  PipelineConstructCodeBuildRolemogambopreview29A483FE:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: codebuild.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/AmazonS3FullAccess
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/CloudFrontFullAccess
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/CloudWatchFullAccess
      RoleName: CodeBuildRole-mogambo-preview
    Metadata:
      aws:cdk:path: SsgStack/PipelineConstruct/CodeBuildRole-mogambo-preview/Resource
  PipelineConstructCodeBuildRolemogambopreviewDefaultPolicyE4A0E8D9:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - s3:Abort*
              - s3:DeleteObject*
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
              - s3:PutObject
              - s3:PutObjectLegalHold
              - s3:PutObjectRetention
              - s3:PutObjectTagging
              - s3:PutObjectVersionTagging
            Effect: Allow
            Resource:
              - Fn::GetAtt:
                  - CloudFrontToS3S3Bucket9CE6AB04
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - CloudFrontToS3S3Bucket9CE6AB04
                        - Arn
                    - /*
          - Action:
              - logs:CreateLogGroup
              - logs:CreateLogStream
              - logs:PutLogEvents
            Effect: Allow
            Resource:
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - ":logs:"
                    - Ref: AWS::Region
                    - ":"
                    - Ref: AWS::AccountId
                    - :log-group:/aws/codebuild/
                    - Ref: PipelineConstructCodeBuildProjectmogambopreview478BC1FA
                    - :*
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - ":logs:"
                    - Ref: AWS::Region
                    - ":"
                    - Ref: AWS::AccountId
                    - :log-group:/aws/codebuild/
                    - Ref: PipelineConstructCodeBuildProjectmogambopreview478BC1FA
          - Action:
              - codebuild:BatchPutCodeCoverages
              - codebuild:BatchPutTestCases
              - codebuild:CreateReport
              - codebuild:CreateReportGroup
              - codebuild:UpdateReport
            Effect: Allow
            Resource:
              Fn::Join:
                - ""
                - - "arn:"
                  - Ref: AWS::Partition
                  - ":codebuild:"
                  - Ref: AWS::Region
                  - ":"
                  - Ref: AWS::AccountId
                  - :report-group/
                  - Ref: PipelineConstructCodeBuildProjectmogambopreview478BC1FA
                  - -*
        Version: "2012-10-17"
      PolicyName: PipelineConstructCodeBuildRolemogambopreviewDefaultPolicyE4A0E8D9
      Roles:
        - Ref: PipelineConstructCodeBuildRolemogambopreview29A483FE
    Metadata:
      aws:cdk:path: SsgStack/PipelineConstruct/CodeBuildRole-mogambo-preview/DefaultPolicy/Resource
  PipelineConstructCodeBuildProjectmogambopreview478BC1FA:
    Type: AWS::CodeBuild::Project
    Properties:
      Artifacts:
        Location:
          Ref: CloudFrontToS3S3Bucket9CE6AB04
        NamespaceType: BUILD_ID
        OverrideArtifactName: true
        Packaging: ZIP
        Type: S3
      Cache:
        Type: NO_CACHE
      EncryptionKey: alias/aws/s3
      Environment:
        ComputeType: BUILD_GENERAL1_SMALL
        Image: aws/codebuild/amazonlinux2-aarch64-standard:3.0
        ImagePullCredentialsType: CODEBUILD
        PrivilegedMode: true
        Type: ARM_CONTAINER
      Name: CodeBuildProject-mogambo-preview
      ServiceRole:
        Fn::GetAtt:
          - PipelineConstructCodeBuildRolemogambopreview29A483FE
          - Arn
      Source:
        BuildSpec: |-
          {
            "version": "0.2",
            "phases": {
              "install": {
                "runtime-versions": {
                  "nodejs": "nodejs18.x"
                },
                "commands": [
                  "npm i"
                ]
              },
              "build": {
                "commands": [
                  "npm run build:docs"
                ]
              }
            },
            "artifacts": {
              "files": [
                "**/*"
              ],
              "base-directory": "docs/.vitepress/dist"
            }
          }
        GitCloneDepth: 1
        Location: https://github.com/saddam-azad/vitepress.git
        ReportBuildStatus: true
        Type: GITHUB
      SourceVersion: main
    Metadata:
      aws:cdk:path: SsgStack/PipelineConstruct/CodeBuildProject-mogambo-preview/Resource
```