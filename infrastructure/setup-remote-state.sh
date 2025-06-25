#!/bin/bash

# Setup Remote State for Car Finder Platform
# This script creates the GCS buckets for storing Terraform state

set -e

# Load environment variables
source ../project-ids.env

echo "Setting up remote state buckets..."

# Create state bucket for DEV environment
echo "Creating DEV state bucket..."
gsutil mb -p $PROJECT_ID_DEV gs://car-finder-terraform-state-dev || echo "DEV bucket already exists"
gsutil versioning set on gs://car-finder-terraform-state-dev
gsutil lifecycle set state-lifecycle.json gs://car-finder-terraform-state-dev

# Create state bucket for PROD environment
echo "Creating PROD state bucket..."
gsutil mb -p $PROJECT_ID_PROD gs://car-finder-terraform-state-prod || echo "PROD bucket already exists"
gsutil versioning set on gs://car-finder-terraform-state-prod
gsutil lifecycle set state-lifecycle.json gs://car-finder-terraform-state-prod

echo "Remote state buckets created successfully!"
echo ""
echo "DEV State Bucket: gs://car-finder-terraform-state-dev"
echo "PROD State Bucket: gs://car-finder-terraform-state-prod"
echo ""
echo "You can now run 'terraform init' in the environment directories."