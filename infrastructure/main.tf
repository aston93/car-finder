# Car Finder Platform - Main Terraform Configuration

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
  }
}

# Variables
variable "project_id_dev" {
  description = "GCP Project ID for DEV environment"
  type        = string
}

variable "project_id_prod" {
  description = "GCP Project ID for PROD environment"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "europe-west4"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "europe-west4-a"
}

variable "labels" {
  description = "Common labels to apply to resources"
  type        = map(string)
  default = {
    project    = "car-finder"
    managed-by = "terraform"
  }
}

# Outputs
output "dev_project_id" {
  value = var.project_id_dev
}

output "prod_project_id" {
  value = var.project_id_prod
}