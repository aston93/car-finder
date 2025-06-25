# PROD Environment Configuration

terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }

  backend "gcs" {
    bucket = "car-finder-terraform-state-prod"
    prefix = "prod/terraform.tfstate"
  }
}

# Configure providers
provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Local variables
locals {
  environment = "prod"
  labels = merge(var.labels, {
    environment = "prod"
  })
}

# IAM module
module "iam" {
  source = "../../modules/iam"

  project_id                   = var.project_id
  environment                  = local.environment
  kubernetes_namespace         = "default"
  kubernetes_service_account   = "car-finder-app"
}

# VPC module
module "vpc" {
  source = "../../modules/vpc"

  project_id       = var.project_id
  environment      = local.environment
  region           = var.region
  labels           = local.labels
  gke_subnet_cidr  = "10.10.1.0/24"
  db_subnet_cidr   = "10.10.2.0/24"
  pods_cidr        = "10.11.0.0/16"
  services_cidr    = "10.12.0.0/16"
}

# GKE module
module "gke" {
  source = "../../modules/gke"

  project_id               = var.project_id
  environment              = local.environment
  region                   = var.region
  zone                     = var.zone
  vpc_id                   = module.vpc.vpc_id
  subnet_id                = module.vpc.gke_subnet_id
  pods_range_name          = module.vpc.pods_range_name
  services_range_name      = module.vpc.services_range_name
  service_account_email    = module.iam.gke_service_account_email
  labels                   = local.labels
  
  # PROD-specific settings
  node_count               = 2
  min_node_count           = 2
  max_node_count           = 10
  machine_type             = "e2-standard-2"
  disk_size_gb             = 50
  preemptible_nodes        = false  # Use regular nodes for stability

  depends_on = [module.iam, module.vpc]
}

# Cloud SQL module
module "cloudsql" {
  source = "../../modules/cloudsql"

  project_id            = var.project_id
  environment           = local.environment
  region                = var.region
  vpc_id                = module.vpc.vpc_id
  labels                = local.labels
  
  # PROD-specific settings
  tier                  = "db-g1-small"
  availability_type     = "REGIONAL"  # High availability
  disk_type             = "PD_SSD"    # Better performance
  disk_size             = 50
  deletion_protection   = true        # Prevent accidental deletion

  depends_on = [module.vpc]
}

# Storage module
module "storage" {
  source = "../../modules/storage"

  project_id                   = var.project_id
  environment                  = local.environment
  region                       = var.region
  labels                       = local.labels
  storage_class                = "STANDARD"
  versioning_enabled           = true   # Enable versioning in PROD
  app_service_account_email    = module.iam.app_service_account_email
  cors_origins                 = [var.app_domain]  # Restrict CORS in PROD

  depends_on = [module.iam]
}

# Monitoring module
module "monitoring" {
  source = "../../modules/monitoring"

  project_id         = var.project_id
  environment        = local.environment
  region             = var.region
  labels             = local.labels
  notification_email = var.notification_email
  app_domain         = var.app_domain
}