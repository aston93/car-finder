# IAM Module Outputs

output "gke_service_account_email" {
  description = "Email of the GKE service account"
  value       = google_service_account.gke_service_account.email
}

output "app_service_account_email" {
  description = "Email of the application service account"
  value       = google_service_account.app_service_account.email
}

output "cloudsql_service_account_email" {
  description = "Email of the Cloud SQL service account"
  value       = google_service_account.cloudsql_service_account.email
}

output "cicd_service_account_email" {
  description = "Email of the CI/CD service account"
  value       = google_service_account.cicd_service_account.email
}

output "gke_service_account_id" {
  description = "ID of the GKE service account"
  value       = google_service_account.gke_service_account.id
}

output "app_service_account_id" {
  description = "ID of the application service account"
  value       = google_service_account.app_service_account.id
}