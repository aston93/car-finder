# Monitoring Module Outputs

output "audit_logs_bucket_name" {
  description = "Name of the audit logs bucket"
  value       = google_storage_bucket.audit_logs.name
}

output "notification_channel_id" {
  description = "ID of the email notification channel"
  value       = google_monitoring_notification_channel.email.name
}

output "dashboard_url" {
  description = "URL of the monitoring dashboard"
  value       = "https://console.cloud.google.com/monitoring/dashboards?project=${var.project_id}"
}