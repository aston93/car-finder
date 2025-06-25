# Cloud SQL Module Variables

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

variable "vpc_id" {
  description = "VPC ID for private IP configuration"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}

variable "database_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "POSTGRES_15"
}

variable "tier" {
  description = "Machine type for Cloud SQL instance"
  type        = string
  default     = "db-f1-micro"
}

variable "availability_type" {
  description = "Availability type (ZONAL or REGIONAL)"
  type        = string
  default     = "ZONAL"
}

variable "disk_type" {
  description = "Disk type (PD_SSD or PD_HDD)"
  type        = string
  default     = "PD_HDD"
}

variable "disk_size" {
  description = "Disk size in GB"
  type        = number
  default     = 10
}

variable "database_name" {
  description = "Name of the database"
  type        = string
  default     = "carfinder"
}

variable "database_user" {
  description = "Database username"
  type        = string
  default     = "carfinder_user"
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}