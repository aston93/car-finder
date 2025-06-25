# PROD Environment Variables

variable "project_id" {
  description = "GCP Project ID for PROD environment"
  type        = string
  default     = "car-finder-prod"
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

variable "notification_email" {
  description = "Email address for monitoring notifications"
  type        = string
  default     = "admin@carfinder.com"
}

variable "app_domain" {
  description = "Domain name for the production application"
  type        = string
  default     = "carfinder.com"
}