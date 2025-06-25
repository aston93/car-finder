# Storage Module Variables

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

variable "storage_class" {
  description = "Storage class for car images bucket"
  type        = string
  default     = "STANDARD"
}

variable "versioning_enabled" {
  description = "Enable versioning for car images bucket"
  type        = bool
  default     = true
}

variable "cors_origins" {
  description = "CORS origins for buckets"
  type        = list(string)
  default     = ["*"]
}

variable "app_service_account_email" {
  description = "Service account email for application access"
  type        = string
}