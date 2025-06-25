# DEV Environment Configuration

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
    bucket = "car-finder-terraform-state-dev"
    prefix = "dev/terraform.tfstate"
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
  environment = "dev"
  labels = merge(var.labels, {
    environment = "dev"
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
  gke_subnet_cidr  = "10.0.1.0/24"
  db_subnet_cidr   = "10.0.2.0/24"
  pods_cidr        = "10.1.0.0/16"
  services_cidr    = "10.2.0.0/16"
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
  
  # DEV-specific settings
  node_count               = 1
  min_node_count           = 1
  max_node_count           = 3
  machine_type             = "e2-medium"
  disk_size_gb             = 20
  preemptible_nodes        = true

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
  
  # DEV-specific settings
  tier                  = "db-f1-micro"
  availability_type     = "ZONAL"
  disk_type             = "PD_HDD"
  disk_size             = 10
  deletion_protection   = false  # Allow deletion in DEV

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
  versioning_enabled           = false  # Disable versioning in DEV
  app_service_account_email    = module.iam.app_service_account_email
  cors_origins                 = ["*"]  # Allow all origins in DEV

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