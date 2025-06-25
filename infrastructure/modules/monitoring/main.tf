# Monitoring Module for Car Finder Platform

# Log sink for audit logs
resource "google_logging_project_sink" "audit_sink" {
  name        = "${var.environment}-audit-sink"
  project     = var.project_id
  destination = "storage.googleapis.com/${google_storage_bucket.audit_logs.name}"

  filter = <<EOF
protoPayload.serviceName="container.googleapis.com" OR
protoPayload.serviceName="sqladmin.googleapis.com" OR
protoPayload.serviceName="storage.googleapis.com"
EOF

  unique_writer_identity = true
}

# Storage bucket for audit logs
resource "google_storage_bucket" "audit_logs" {
  name          = "${var.environment}-audit-logs-${random_id.audit_suffix.hex}"
  project       = var.project_id
  location      = var.region
  storage_class = "COLDLINE"

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }

  labels = merge(var.labels, {
    environment = var.environment
    purpose     = "audit-logs"
  })
}

resource "random_id" "audit_suffix" {
  byte_length = 4
}

# IAM binding for log sink
resource "google_storage_bucket_iam_binding" "audit_logs_sink_binding" {
  bucket = google_storage_bucket.audit_logs.name
  role   = "roles/storage.objectCreator"

  members = [
    google_logging_project_sink.audit_sink.writer_identity,
  ]
}

# Notification channel for alerts (email)
resource "google_monitoring_notification_channel" "email" {
  project      = var.project_id
  display_name = "${var.environment} Email Notifications"
  type         = "email"

  labels = {
    email_address = var.notification_email
  }

  enabled = true
}

# Alert policies commented out for initial deployment
# Can be enabled after GKE cluster is running and generating metrics

# # Alert policy for high CPU usage
# resource "google_monitoring_alert_policy" "high_cpu" {
#   project      = var.project_id
#   display_name = "${var.environment} High CPU Usage"
#   combiner     = "OR"

#   conditions {
#     display_name = "GKE nodes high CPU"

#     condition_threshold {
#       filter          = "resource.type=\"k8s_node\" AND resource.label.project_id=\"${var.project_id}\""
#       duration        = "300s"
#       comparison      = "COMPARISON_GT"
#       threshold_value = 0.8

#       aggregations {
#         alignment_period   = "60s"
#         per_series_aligner = "ALIGN_MEAN"
#       }
#     }
#   }

#   notification_channels = [
#     google_monitoring_notification_channel.email.name
#   ]

#   alert_strategy {
#     auto_close = "1800s"
#   }

#   enabled = true
# }

# Uptime check commented out for initial deployment
# Will be enabled once application is deployed

# resource "google_monitoring_uptime_check_config" "app_uptime_check" {
#   project      = var.project_id
#   display_name = "${var.environment} Application Uptime Check"
#   timeout      = "10s"
#   period       = "300s"

#   http_check {
#     path         = "/health"
#     port         = 80
#     use_ssl      = false
#     validate_ssl = false
#   }

#   monitored_resource {
#     type = "uptime_url"
#     labels = {
#       project_id = var.project_id
#       host       = var.app_domain != "" ? var.app_domain : "localhost"
#     }
#   }

#   content_matchers {
#     content = "OK"
#     matcher = "CONTAINS_STRING"
#   }
# }

# Dashboard commented out for initial deployment
# Will be enabled after GKE cluster is running and generating metrics

# resource "google_monitoring_dashboard" "main_dashboard" {
#   project        = var.project_id
#   dashboard_json = templatefile("${path.module}/dashboard.json", {
#     project_id  = var.project_id
#     environment = var.environment
#   })
# }