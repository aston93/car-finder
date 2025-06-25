# DEV Environment Outputs

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

output "vpc_name" {
  description = "VPC network name"
  value       = module.vpc.vpc_name
}

output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = module.gke.cluster_name
}

output "gke_cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = module.gke.cluster_endpoint
  sensitive   = true
}

output "database_instance_name" {
  description = "Cloud SQL instance name"
  value       = module.cloudsql.instance_name
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = module.cloudsql.connection_name
}

output "car_images_bucket" {
  description = "Car images storage bucket name"
  value       = module.storage.car_images_bucket_name
}

output "artifact_registry_url" {
  description = "Artifact Registry URL"
  value       = module.gke.artifact_registry_url
}

output "app_service_account_email" {
  description = "Application service account email"
  value       = module.iam.app_service_account_email
}

output "cicd_service_account_email" {
  description = "CI/CD service account email"
  value       = module.iam.cicd_service_account_email
}

output "dashboard_url" {
  description = "Monitoring dashboard URL"
  value       = module.monitoring.dashboard_url
}