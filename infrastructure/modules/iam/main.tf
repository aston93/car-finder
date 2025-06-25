# IAM Module for Car Finder Platform

# Service account for GKE nodes
resource "google_service_account" "gke_service_account" {
  account_id   = "${var.environment}-gke-sa"
  project      = var.project_id
  display_name = "GKE Service Account for ${var.environment}"
  description  = "Service account for GKE cluster nodes in ${var.environment} environment"
}

# Service account for the application
resource "google_service_account" "app_service_account" {
  account_id   = "${var.environment}-app-sa"
  project      = var.project_id
  display_name = "Application Service Account for ${var.environment}"
  description  = "Service account for the Car Finder application in ${var.environment} environment"
}

# Service account for Cloud SQL Proxy
resource "google_service_account" "cloudsql_service_account" {
  account_id   = "${var.environment}-cloudsql-sa"
  project      = var.project_id
  display_name = "Cloud SQL Service Account for ${var.environment}"
  description  = "Service account for Cloud SQL operations in ${var.environment} environment"
}

# Service account for CI/CD
resource "google_service_account" "cicd_service_account" {
  account_id   = "${var.environment}-cicd-sa"
  project      = var.project_id
  display_name = "CI/CD Service Account for ${var.environment}"
  description  = "Service account for CI/CD pipeline in ${var.environment} environment"
}

# IAM roles for GKE service account
resource "google_project_iam_member" "gke_node_service_account" {
  project = var.project_id
  role    = "roles/container.nodeServiceAccount"
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

resource "google_project_iam_member" "gke_storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

resource "google_project_iam_member" "gke_monitoring_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

resource "google_project_iam_member" "gke_logging_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.gke_service_account.email}"
}

# IAM roles for application service account
resource "google_project_iam_member" "app_storage_object_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "app_secret_manager_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "app_monitoring_metric_writer" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

resource "google_project_iam_member" "app_logging_log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.app_service_account.email}"
}

# IAM roles for Cloud SQL service account
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloudsql_service_account.email}"
}

# IAM roles for CI/CD service account
resource "google_project_iam_member" "cicd_container_developer" {
  project = var.project_id
  role    = "roles/container.developer"
  member  = "serviceAccount:${google_service_account.cicd_service_account.email}"
}

resource "google_project_iam_member" "cicd_storage_admin" {
  project = var.project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.cicd_service_account.email}"
}

resource "google_project_iam_member" "cicd_artifact_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.cicd_service_account.email}"
}

resource "google_project_iam_member" "cicd_secret_manager_admin" {
  project = var.project_id
  role    = "roles/secretmanager.admin"
  member  = "serviceAccount:${google_service_account.cicd_service_account.email}"
}

# Workload Identity binding - commented out for initial deployment
# Will be enabled after GKE cluster is created and Workload Identity is configured

# resource "google_service_account_iam_binding" "workload_identity_binding" {
#   service_account_id = google_service_account.app_service_account.name
#   role               = "roles/iam.workloadIdentityUser"

#   members = [
#     "serviceAccount:${var.project_id}.svc.id.goog[${var.kubernetes_namespace}/${var.kubernetes_service_account}]",
#   ]
# }