# IAM Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "environment" {
  description = "Environment name (dev/prod)"
  type        = string
}

variable "kubernetes_namespace" {
  description = "Kubernetes namespace for workload identity"
  type        = string
  default     = "default"
}

variable "kubernetes_service_account" {
  description = "Kubernetes service account name for workload identity"
  type        = string
  default     = "car-finder-app"
}