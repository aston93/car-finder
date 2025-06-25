# Cloud SQL Module Outputs

output "instance_name" {
  description = "Name of the Cloud SQL instance"
  value       = google_sql_database_instance.main.name
}

output "instance_ip_address" {
  description = "Private IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.main.private_ip_address
  sensitive   = true
}

output "database_name" {
  description = "Name of the database"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "Database username"
  value       = google_sql_user.users.name
}

output "connection_name" {
  description = "Connection name for Cloud SQL Proxy"
  value       = google_sql_database_instance.main.connection_name
}

output "password_secret_id" {
  description = "Secret Manager secret ID for database password"
  value       = google_secret_manager_secret.db_password.secret_id
}