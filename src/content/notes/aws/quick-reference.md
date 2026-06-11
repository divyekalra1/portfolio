---
title: "Quick Reference & Terminology"
description: "AWS services quick reference, important terminology, and course references."
series: aws
order: 5
tags: ["aws", "reference"]
---

## AWS Services Quick Reference

This is a summary of all the AWS services and terms I learned throughout the four parts.

### Identity and Access Management

- **AWS IAM Identity Center** -- Centralized service for managing workforce access to multiple AWS accounts and applications
- **AWS KMS** -- Key Management Service for encryption keys
- **AWS Secrets Manager** -- Securely stores database credentials, API keys, and tokens
- **AWS Certificate Manager** -- Provision, manage, deploy SSL/TLS certificates

### Networking

- **VPC** -- Virtual Private Cloud
- **Route Tables** -- Direct traffic within your VPC
- **Security Groups** -- Stateful firewall for resources
- **NACL** -- Network Access Control List (stateless)
- **AWS Direct Connect** -- Dedicated private connection
- **VPG** -- Virtual Private Gateway
- **AWS Route 53** -- DNS service

### Compute

- **AWS EC2** -- Elastic Compute Cloud
- **Reserved Instances** -- Commit to usage for discounts
- **Spot Instances** -- Bid on unused capacity
- **AWS Lambda** -- Serverless compute
- **AWS Fargate** -- Serverless containers
- **Amazon API Gateway** -- Create, publish, and secure APIs

### Storage

- **Amazon S3** -- Object storage with various storage classes
- **Amazon EBS** -- Elastic Block Storage
- **Amazon EFS** -- Elastic File System
- **Instance Store** -- Temporary block storage
- **AWS Storage Gateway** -- Hybrid storage integration

### Databases

- **Amazon RDS** -- Managed relational database service
- **Amazon Aurora** -- High-performance MySQL/PostgreSQL compatible
- **Amazon DynamoDB** -- NoSQL key-value database
- **Amazon MemoryDB** -- In-memory database
- **Amazon Neptune** -- Graph database

### Monitoring and Logging

- **AWS CloudTrail** -- Audit log of all API activity
- **Amazon CloudWatch** -- Metrics, dashboards, and alerts
- **AWS Health** -- Personalized view of AWS service health
- **AWS Config** -- Configuration history and change notifications

### Security

- **AWS WAF** -- Web Application Firewall
- **AWS Shield** -- DDoS protection
- **AWS Inspector** -- Vulnerability assessments
- **AWS Security Hub** -- Centralized security posture management
- **Amazon GuardDuty** -- Threat detection

### Scalability and Load Balancing

- **EC2 Auto Scaling** -- Automatic instance scaling
- **Elastic Load Balancing** -- Distribute traffic

### Messaging and Notifications

- **Amazon SQS** -- Simple Queue Service
- **Amazon SNS** -- Simple Notification Service
- **Amazon SES** -- Simple Email Service
- **Amazon EventBridge** -- Serverless event bus

### Data Analytics

- **Amazon Athena** -- Serverless SQL queries on S3
- **Amazon EMR** -- Big data analytics
- **AWS Glue** -- ETL service
- **Amazon Redshift** -- Data warehousing
- **Amazon Kinesis** -- Real-time streaming
- **Amazon QuickSight** -- Data visualization

### AI and Machine Learning

- **Amazon SageMaker** -- Build, train, deploy ML models
- **Amazon Bedrock** -- Foundation Models
- **Amazon Comprehend** -- NLP insights
- **Amazon Q** -- Generative AI assistant
- **Amazon Rekognition** -- Image and video analysis
- **Amazon Translate** -- Machine translation
- **Amazon Lex** -- Chatbots and voice assistants
- **Amazon Polly** -- Text-to-speech
- **Amazon Transcribe** -- Speech-to-text
- **Amazon Textract** -- Document text extraction
- **Amazon Kendra** -- Enterprise search
- **Amazon Forecast** -- Business outcome predictions

### Edge Services

- **AWS Outposts** -- On-premises AWS infrastructure
- **AWS Wavelength** -- 5G edge computing
- **AWS Local Zones** -- Low-latency extensions
- **Amazon CloudFront** -- CDN

### Deployment and Management

- **AWS CloudFormation** -- Infrastructure as code
- **AWS Elastic Beanstalk** -- Easy application deployment
- **AWS CodeDeploy** -- Automated deployments
- **Amazon Lightsail** -- Simple VPS hosting
- **AWS Organizations** -- Multi-account management
- **AWS Trusted Advisor** -- Optimization recommendations
- **AWS Artifact** -- Compliance documents

### Pricing and Cost Management

- **AWS Pricing Calculator** -- Estimate costs
- **AWS Cost Explorer** -- Analytics tool for costs
- **AWS Cost and Usage Reports** -- Detailed usage records
- **AWS Budgets** -- Set custom cost and usage alerts

### Migration

- **AWS DMS** -- Database Migration Service
- **AWS Storage Gateway** -- Hybrid storage for backups
- **AWS Marketplace** -- Software and licensing

------------------------------------------------------------------------

## Important Terminology

| Term | Definition |
|----|----|
| **Availability Zone** | A distinct location in an AWS Region insulated from failures in other AZs |
| **Region** | A named set of AWS resources in the same geographical area (at least 3 AZs) |
| **Edge Location** | A data center for service-specific operations (points of presence) |
| **Availability** | Whether an application is accessible and usable on demand |
| **Resiliency** | Ability of a system to recover and continue operating during disruptions |
| **Scalability** | Ability to grow as workload demands change |
| **Elasticity** | Ability to acquire and release resources automatically as needed |
| **Durability** | Ability to ensure long-term data stability |
| **CIDR** | Classless Inter-Domain Routing -- IP address allocation methodology |
| **MFA** | Multi-Factor Authentication |
| **CSP** | Cloud Service Provider |
| **DNS** | Domain Name System -- translates domain names to IP addresses |
| **TLS/SSL** | Cryptographic protocols for secure communication |

------------------------------------------------------------------------

## References

- [AWS Documentation](https://docs.aws.amazon.com/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
- [AWS Cloud Adoption Framework](https://aws.amazon.com/professional-services/CAF/)
- [AWS Global Infrastructure](https://aws.amazon.com/about-aws/global-infrastructure/)
- [AWS Pricing Calculator](https://calculator.aws)
