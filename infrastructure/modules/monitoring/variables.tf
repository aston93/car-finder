# Monitoring Module Variables

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

variable "notification_email" {
  description = "Email address for monitoring notifications"
  type        = string
  default     = "admin@example.com"
}

variable "app_domain" {
  description = "Domain name for uptime checks"
  type        = string
  default     = ""
}