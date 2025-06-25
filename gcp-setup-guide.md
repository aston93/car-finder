# GCP Project Setup Guide - Car Offers Platform

## Prerequisites
- Google Cloud account with billing enabled
- Google Cloud CLI installed (`gcloud` command)
- Terraform installed (for infrastructure as code)

## Step 1: Create GCP Projects

### 1.1 Create Development Project
```bash
# Set variables
export PROJECT_ID_DEV="car-offers-dev-$(date +%s)"
export PROJECT_NAME_DEV="Car Offers DEV"
export ORGANIZATION_ID="YOUR_ORG_ID"  # Optional, if you have an organization

# Create DEV project
gcloud projects create $PROJECT_ID_DEV \
    --name="$PROJECT_NAME_DEV" \
    --labels=environment=dev,project=car-offers

echo "DEV Project created: $PROJECT_ID_DEV"
```

### 1.2 Create Production Project
```bash
# Set variables
export PROJECT_ID_PROD="car-offers-prod-$(date +%s)"
export PROJECT_NAME_PROD="Car Offers PROD"

# Create PROD project
gcloud projects create $PROJECT_ID_PROD \
    --name="$PROJECT_NAME_PROD" \
    --labels=environment=prod,project=car-offers

echo "PROD Project created: $PROJECT_ID_PROD"
```

### 1.3 Save Project IDs
```bash
# Save project IDs for future use
cat > project-ids.env << EOF
# Car Offers Platform - GCP Project IDs
export PROJECT_ID_DEV="$PROJECT_ID_DEV"
export PROJECT_ID_PROD="$PROJECT_ID_PROD"
export REGION="europe-west4"
export ZONE="europe-west4-a"
EOF

echo "Project IDs saved to project-ids.env"
source project-ids.env
```

## Step 2: Enable Required APIs

### 2.1 APIs for DEV Environment
```bash
# Set current project to DEV
gcloud config set project $PROJECT_ID_DEV

# Enable required APIs for DEV
gcloud services enable \
    container.googleapis.com \
    compute.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    storage-component.googleapis.com \
    storage.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    firebase.googleapis.com \
    identitytoolkit.googleapis.com \
    dns.googleapis.com

echo "APIs enabled for DEV project: $PROJECT_ID_DEV"
```

### 2.2 APIs for PROD Environment
```bash
# Set current project to PROD
gcloud config set project $PROJECT_ID_PROD

# Enable required APIs for PROD
gcloud services enable \
    container.googleapis.com \
    compute.googleapis.com \
    sql-component.googleapis.com \
    sqladmin.googleapis.com \
    storage-component.googleapis.com \
    storage.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    secretmanager.googleapis.com \
    iam.googleapis.com \
    cloudresourcemanager.googleapis.com \
    monitoring.googleapis.com \
    logging.googleapis.com \
    firebase.googleapis.com \
    identitytoolkit.googleapis.com \
    dns.googleapis.com

echo "APIs enabled for PROD project: $PROJECT_ID_PROD"
```

## Step 3: Set Up Billing and Budget Alerts

### 3.1 Link Billing Account
```bash
# List available billing accounts
gcloud billing accounts list

# Set your billing account ID
export BILLING_ACCOUNT_ID="YOUR_BILLING_ACCOUNT_ID"

# Link billing to DEV project
gcloud billing projects link $PROJECT_ID_DEV \
    --billing-account=$BILLING_ACCOUNT_ID

# Link billing to PROD project
gcloud billing projects link $PROJECT_ID_PROD \
    --billing-account=$BILLING_ACCOUNT_ID

echo "Billing linked to both projects"
```

### 3.2 Create Budget Alerts
```bash
# Create budget for DEV (€150/month)
cat > dev-budget.json << EOF
{
  "displayName": "Car Offers DEV Budget",
  "budgetFilter": {
    "projects": ["projects/$PROJECT_ID_DEV"]
  },
  "amount": {
    "specifiedAmount": {
      "currencyCode": "EUR",
      "units": "150"
    }
  },
  "thresholdRules": [
    {
      "thresholdPercent": 0.5,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 0.9,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 1.0,
      "spendBasis": "CURRENT_SPEND"
    }
  ]
}
EOF

# Create budget for PROD (€300/month)
cat > prod-budget.json << EOF
{
  "displayName": "Car Offers PROD Budget",
  "budgetFilter": {
    "projects": ["projects/$PROJECT_ID_PROD"]
  },
  "amount": {
    "specifiedAmount": {
      "currencyCode": "EUR",
      "units": "300"
    }
  },
  "thresholdRules": [
    {
      "thresholdPercent": 0.5,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 0.9,
      "spendBasis": "CURRENT_SPEND"
    },
    {
      "thresholdPercent": 1.0,
      "spendBasis": "CURRENT_SPEND"
    }
  ]
}
EOF

echo "Budget configuration files created"
echo "Note: Create budgets manually in GCP Console > Billing > Budgets & alerts"
```

## Step 4: Configure IAM Roles and Service Accounts

### 4.1 Create Service Accounts for DEV
```bash
# Set current project to DEV
gcloud config set project $PROJECT_ID_DEV

# Create service account for GKE
gcloud iam service-accounts create gke-service-account \
    --display-name="GKE Service Account" \
    --description="Service account for GKE cluster operations"

# Create service account for Cloud SQL
gcloud iam service-accounts create cloudsql-service-account \
    --display-name="Cloud SQL Service Account" \
    --description="Service account for Cloud SQL operations"

# Create service account for CI/CD
gcloud iam service-accounts create cicd-service-account \
    --display-name="CI/CD Service Account" \
    --description="Service account for CI/CD pipeline"

echo "Service accounts created for DEV"
```

### 4.2 Create Service Accounts for PROD
```bash
# Set current project to PROD
gcloud config set project $PROJECT_ID_PROD

# Create service account for GKE
gcloud iam service-accounts create gke-service-account \
    --display-name="GKE Service Account" \
    --description="Service account for GKE cluster operations"

# Create service account for Cloud SQL
gcloud iam service-accounts create cloudsql-service-account \
    --display-name="Cloud SQL Service Account" \
    --description="Service account for Cloud SQL operations"

# Create service account for CI/CD
gcloud iam service-accounts create cicd-service-account \
    --display-name="CI/CD Service Account" \
    --description="Service account for CI/CD pipeline"

echo "Service accounts created for PROD"
```

### 4.3 Assign IAM Roles
```bash
# Function to assign roles for a project
assign_roles() {
    local PROJECT_ID=$1
    
    # GKE Service Account roles
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:gke-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/container.nodeServiceAccount"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:gke-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/storage.objectViewer"
    
    # Cloud SQL Service Account roles
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:cloudsql-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/cloudsql.client"
    
    # CI/CD Service Account roles
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:cicd-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/container.developer"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:cicd-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/storage.admin"
    
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:cicd-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
        --role="roles/artifactregistry.writer"
}

# Assign roles for both environments
assign_roles $PROJECT_ID_DEV
assign_roles $PROJECT_ID_PROD

echo "IAM roles assigned for both projects"
```

## Step 5: Initial Security and Policies

### 5.1 Enable Organization Policies (if applicable)
```bash
# Example organization policies (uncomment if you have an organization)
# gcloud resource-manager org-policies set-policy \
#     --organization=$ORGANIZATION_ID \
#     compute-requireOsLogin.yaml

# gcloud resource-manager org-policies set-policy \
#     --organization=$ORGANIZATION_ID \
#     compute-restrictVpcPeering.yaml

echo "Organization policies can be configured if needed"
```

### 5.2 Set up Audit Logging
```bash
# Function to enable audit logging
enable_audit_logging() {
    local PROJECT_ID=$1
    
    cat > audit-policy.json << EOF
{
  "auditConfigs": [
    {
      "service": "container.googleapis.com",
      "auditLogConfigs": [
        {
          "logType": "ADMIN_READ"
        },
        {
          "logType": "DATA_READ"
        },
        {
          "logType": "DATA_WRITE"
        }
      ]
    },
    {
      "service": "sqladmin.googleapis.com",
      "auditLogConfigs": [
        {
          "logType": "ADMIN_READ"
        },
        {
          "logType": "DATA_READ"
        },
        {
          "logType": "DATA_WRITE"
        }
      ]
    }
  ]
}
EOF
    
    gcloud logging sinks create audit-sink-$PROJECT_ID \
        storage.googleapis.com/audit-logs-$PROJECT_ID \
        --project=$PROJECT_ID \
        --log-filter='protoPayload.serviceName="container.googleapis.com" OR protoPayload.serviceName="sqladmin.googleapis.com"'
}

# Enable audit logging for both projects
enable_audit_logging $PROJECT_ID_DEV
enable_audit_logging $PROJECT_ID_PROD

echo "Audit logging configured for both projects"
```

## Step 6: Verification and Next Steps

### 6.1 Verify Setup
```bash
# Verify projects
echo "=== DEV Project ==="
gcloud config set project $PROJECT_ID_DEV
gcloud projects describe $PROJECT_ID_DEV
echo ""

echo "=== PROD Project ==="
gcloud config set project $PROJECT_ID_PROD
gcloud projects describe $PROJECT_ID_PROD
echo ""

# Verify enabled APIs
echo "=== Enabled APIs (DEV) ==="
gcloud services list --enabled --project=$PROJECT_ID_DEV
echo ""

echo "=== Enabled APIs (PROD) ==="
gcloud services list --enabled --project=$PROJECT_ID_PROD
```

### 6.2 Export Configuration
```bash
# Create configuration file for Terraform
cat > terraform.tfvars << EOF
# Car Offers Platform - Terraform Variables
project_id_dev  = "$PROJECT_ID_DEV"
project_id_prod = "$PROJECT_ID_PROD"
region         = "$REGION"
zone           = "$ZONE"
billing_account = "$BILLING_ACCOUNT_ID"

# Common labels
labels = {
  project     = "car-offers"
  managed-by  = "terraform"
}
EOF

echo "Terraform variables file created: terraform.tfvars"
```

## Summary

✅ **Projects Created:**
- DEV: `$PROJECT_ID_DEV`
- PROD: `$PROJECT_ID_PROD`

✅ **APIs Enabled:**
- Container Engine, Compute Engine, Cloud SQL
- Cloud Storage, Cloud Build, Artifact Registry
- Secret Manager, IAM, Monitoring, Logging
- Firebase Auth, DNS

✅ **Billing Configured:**
- Budget alerts at 50%, 90%, 100%
- DEV: €150/month, PROD: €300/month

✅ **Security Setup:**
- Service accounts created
- IAM roles assigned
- Audit logging enabled

## Next Steps
1. **Terraform Infrastructure** - Set up VPC, GKE, Cloud SQL
2. **GitHub Repository** - Initialize with proper structure
3. **CI/CD Pipeline** - Configure GitHub Actions

**Important Files Created:**
- `project-ids.env` - Project environment variables
- `terraform.tfvars` - Terraform configuration
- `dev-budget.json` & `prod-budget.json` - Budget configurations