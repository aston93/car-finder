# Car Finder Platform - Terraform Infrastructure

This directory contains the Infrastructure as Code (IaC) configuration for the Car Finder platform using Terraform.

## Structure

```
infrastructure/
├── modules/                    # Reusable Terraform modules
│   ├── vpc/                   # VPC and networking
│   ├── gke/                   # Google Kubernetes Engine
│   ├── cloudsql/              # Cloud SQL PostgreSQL
│   ├── storage/               # Cloud Storage buckets
│   ├── iam/                   # Service accounts and IAM
│   └── monitoring/            # Monitoring and alerting
├── environments/              # Environment-specific configurations
│   ├── dev/                   # Development environment
│   └── prod/                  # Production environment
├── setup-remote-state.sh      # Script to create remote state buckets
├── deploy-dev.sh              # Script to deploy DEV environment
├── state-lifecycle.json       # Lifecycle policy for state buckets
└── README.md                  # This file
```

## Prerequisites

1. **Google Cloud CLI installed and authenticated**
   ```bash
   gcloud auth login
   gcloud config set project PROJECT_ID
   ```

2. **Terraform installed** (>= 1.5)
   ```bash
   terraform version
   ```

3. **Required GCP APIs enabled** (already done in previous step)

4. **Environment variables set**
   ```bash
   source ../project-ids.env
   ```

## Quick Start

### 1. Setup Remote State

First, create the GCS buckets for storing Terraform state:

```bash
cd infrastructure
chmod +x setup-remote-state.sh
./setup-remote-state.sh
```

### 2. Deploy DEV Environment

Deploy infrastructure to the DEV environment:

```bash
chmod +x deploy-dev.sh
./deploy-dev.sh
```

### 3. Manual PROD Setup (When Ready)

⚠️ **PROD deployment is intentionally manual to prevent accidental deployment**

```bash
cd environments/prod
terraform init
terraform plan -var="project_id=car-finder-prod"
# Review the plan carefully
terraform apply
```

## Environment Differences

| Feature | DEV | PROD |
|---------|-----|------|
| GKE Nodes | 1-3 e2-medium (preemptible) | 2-10 e2-standard-2 (regular) |
| Cloud SQL | db-f1-micro, ZONAL, HDD | db-g1-small, REGIONAL, SSD |
| Storage | No versioning | Versioning enabled |
| CORS | Allow all origins | Restrict to domain |
| Deletion Protection | Disabled | Enabled |

## Key Resources Created

### DEV Environment
- **VPC**: `dev-vpc` with subnets for GKE and DB
- **GKE**: `dev-gke-cluster` with 1-3 preemptible nodes
- **Cloud SQL**: `dev-postgres-*` with basic configuration
- **Storage**: Buckets for images, static assets, and backups
- **IAM**: Service accounts for GKE, app, and CI/CD
- **Monitoring**: Alerts, dashboards, and audit logging

### PROD Environment
- **VPC**: `prod-vpc` with separate IP ranges
- **GKE**: `prod-gke-cluster` with 2-10 regular nodes
- **Cloud SQL**: `prod-postgres-*` with high availability
- **Storage**: Production-grade buckets with versioning
- **IAM**: Production service accounts
- **Monitoring**: Production monitoring and alerting

## Cost Optimization

### DEV Environment (~€15/month)
- Preemptible GKE nodes (70% cost savings)
- Minimal Cloud SQL instance
- No versioning on storage
- Single-zone deployment

### PROD Environment (~€50-100/month)
- Regular GKE nodes for stability
- Regional Cloud SQL with HA
- Storage versioning and lifecycle policies
- Multi-zone deployment

## Security Features

- **Private GKE cluster** with authorized networks
- **VPC-native networking** with secondary IP ranges
- **Workload Identity** for secure pod-to-GCP communication
- **Private Cloud SQL** with VPC peering
- **Service accounts** with least-privilege access
- **Audit logging** for all critical operations

## Monitoring & Alerting

- **Cloud Monitoring** dashboards for infrastructure metrics
- **Alert policies** for CPU, database, and storage issues
- **Audit logs** stored in Cloud Storage
- **Uptime checks** for application availability
- **Email notifications** for critical alerts

## Common Commands

### Initialize Terraform
```bash
cd environments/dev  # or prod
terraform init
```

### Plan Changes
```bash
terraform plan -var="project_id=PROJECT_ID"
```

### Apply Changes
```bash
terraform apply
```

### Show Outputs
```bash
terraform output
```

### Destroy Infrastructure (DEV only)
```bash
terraform destroy -var="project_id=car-finder-dev"
```

## CI/CD Integration

The infrastructure supports CI/CD with:
- **Service accounts** for GitHub Actions
- **Artifact Registry** for container images
- **Workload Identity** for secure deployments
- **Secret Manager** for application secrets

## Troubleshooting

### Common Issues

1. **API not enabled**
   ```bash
   gcloud services enable REQUIRED_API
   ```

2. **Insufficient permissions**
   ```bash
   gcloud auth application-default login
   ```

3. **State bucket doesn't exist**
   ```bash
   ./setup-remote-state.sh
   ```

4. **Resource quota exceeded**
   - Check GCP quotas in the console
   - Request quota increases if needed

### Getting Help

- Check Terraform docs: https://registry.terraform.io/providers/hashicorp/google
- GCP documentation: https://cloud.google.com/docs
- Open an issue in the project repository

## Next Steps

After successful deployment:

1. **Configure kubectl** to access the GKE cluster
2. **Set up application deployment** with Kubernetes manifests
3. **Configure CI/CD pipeline** in GitHub Actions
4. **Set up monitoring dashboards** in Cloud Console
5. **Configure domain and SSL certificates** for production