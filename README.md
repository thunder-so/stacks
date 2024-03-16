# stacks
AWS CDK Stack templates for Thunder.so

## Construct Libraries

Construct libraries are a key component of AWS CDK. They provide pre-packaged patterns of cloud infrastructure that you can use off the shelf, or customize to your needs. Here are the key principles:

Reusability: Construct libraries allow you to encapsulate common patterns of infrastructure into reusable blocks, reducing duplication and increasing efficiency.

Abstraction: They provide a higher level of abstraction over raw cloud resources, making it easier to define complex architectures.

Customizability: While construct libraries provide sensible defaults, they also allow for customization to fit specific use cases.

Composition: Constructs can include other constructs, allowing you to build up complex architectures from simple building blocks.

## Stacks

Stacks are a fundamental part of the AWS Cloud Development Kit (CDK). They are used to define a unit of deployment, such as a network stack for your VPC, and a database stack. Here are the key principles:

Isolation: Stacks provide a way to isolate resources, which can be useful when managing resources across different environments (dev, test, prod).

Deployment Unit: Each stack can be deployed independently, allowing for incremental updates to your infrastructure.

Resource Management: Stacks manage AWS resources, and the AWS CDK automatically takes care of the details around ordering dependencies between resources.

Stack Outputs: Stacks can have outputs, which is a way for you to export information about the resources in your stack.