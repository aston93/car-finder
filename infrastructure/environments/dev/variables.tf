# DEV Environment Variables

variable "project_id" {
  description = "GCP Project ID for DEV environment"
  type        = string
  default     = "car-finder-dev"
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
  default     = "admin@example.com"
}

variable "app_domain" {
  description = "Domain name for the application (optional for DEV)"
  type        = string
  default     = ""
}