# VPC Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "environment" {
  description = "Environment name (dev/prod)"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}

variable "gke_subnet_cidr" {
  description = "CIDR block for GKE subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "db_subnet_cidr" {
  description = "CIDR block for database subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "pods_cidr" {
  description = "CIDR block for GKE pods"
  type        = string
  default     = "10.1.0.0/16"
}

variable "services_cidr" {
  description = "CIDR block for GKE services"
  type        = string
  default     = "10.2.0.0/16"
}