# GKE Module Variables

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

variable "zone" {
  description = "GCP zone for the cluster"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID for GKE cluster"
  type        = string
}

variable "pods_range_name" {
  description = "Name of the secondary IP range for pods"
  type        = string
}

variable "services_range_name" {
  description = "Name of the secondary IP range for services"
  type        = string
}

variable "service_account_email" {
  description = "Service account email for GKE nodes"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}

variable "node_count" {
  description = "Initial number of nodes in the node pool"
  type        = number
  default     = 2
}

variable "min_node_count" {
  description = "Minimum number of nodes in the node pool"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes in the node pool"
  type        = number
  default     = 10
}

variable "machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-medium"
}

variable "disk_size_gb" {
  description = "Disk size in GB for GKE nodes"
  type        = number
  default     = 20
}

variable "preemptible_nodes" {
  description = "Use preemptible nodes for cost savings"
  type        = bool
  default     = true
}