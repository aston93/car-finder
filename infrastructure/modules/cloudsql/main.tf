# Cloud SQL Module for Car Finder Platform

# Random password for database
resource "random_password" "db_password" {
  length  = 16
  special = true
}

# Cloud SQL instance
resource "google_sql_database_instance" "main" {
  name             = "${var.environment}-postgres-${random_id.db_name_suffix.hex}"
  project          = var.project_id
  database_version = var.database_version
  region           = var.region

  deletion_protection = var.deletion_protection

  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_type         = var.disk_type
    disk_size         = var.disk_size
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
        retention_unit   = "COUNT"
      }
    }

    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.vpc_id
      enable_private_path_for_google_cloud_services = true
    }

    maintenance_window {
      day  = 7
      hour = 3
    }

    database_flags {
      name  = "log_statement"
      value = "all"
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = false
      record_client_address   = false
    }

    user_labels = merge(var.labels, {
      environment = var.environment
    })
  }

  depends_on = [google_service_networking_connection.private_vpc_connection]
}

# Random suffix for unique naming
resource "random_id" "db_name_suffix" {
  byte_length = 4
}

# Private VPC connection for Cloud SQL
resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.environment}-private-ip-address"
  project       = var.project_id
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = var.vpc_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = var.vpc_id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

# Database
resource "google_sql_database" "database" {
  name     = var.database_name
  project  = var.project_id
  instance = google_sql_database_instance.main.name
}

# Database user
resource "google_sql_user" "users" {
  name     = var.database_user
  project  = var.project_id
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}

# Store database credentials in Secret Manager
resource "google_secret_manager_secret" "db_password" {
  project   = var.project_id
  secret_id = "${var.environment}-db-password"

  labels = merge(var.labels, {
    environment = var.environment
  })

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret = google_secret_manager_secret.db_password.id
  secret_data = jsonencode({
    username = google_sql_user.users.name
    password = random_password.db_password.result
    host     = google_sql_database_instance.main.private_ip_address
    port     = "5432"
    database = google_sql_database.database.name
  })
}