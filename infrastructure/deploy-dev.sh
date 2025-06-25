#!/bin/bash

# Deploy DEV Environment
# This script deploys the infrastructure to the DEV environment only

set -e

# Load environment variables
source ../project-ids.env

echo "Deploying Car Finder DEV infrastructure..."

# Navigate to DEV environment
cd environments/dev

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Validate configuration
echo "Validating Terraform configuration..."
terraform validate

# Plan deployment
echo "Planning deployment..."
terraform plan -var="project_id=${PROJECT_ID_DEV}" -out=tfplan

# Ask for confirmation
echo ""
echo "This will deploy infrastructure to DEV environment: ${PROJECT_ID_DEV}"
read -p "Do you want to proceed? (y/N): " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "Applying Terraform configuration..."
    terraform apply tfplan
    
    echo ""
    echo "✅ DEV infrastructure deployment completed!"
    echo ""
    echo "Next steps:"
    echo "1. Configure kubectl: gcloud container clusters get-credentials \$(terraform output -raw gke_cluster_name) --zone=${ZONE} --project=${PROJECT_ID_DEV}"
    echo "2. Set up your application deployment"
    echo "3. Configure CI/CD pipeline"
else
    echo "Deployment cancelled."
    rm -f tfplan
fi

cd ../..