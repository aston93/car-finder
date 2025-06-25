# Storage Module for Car Finder Platform

# Random suffix for unique bucket naming
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Cloud Storage bucket for car images
resource "google_storage_bucket" "car_images" {
  name          = "${var.environment}-car-images-${random_id.bucket_suffix.hex}"
  project       = var.project_id
  location      = var.region
  storage_class = var.storage_class

  uniform_bucket_level_access = true

  versioning {
    enabled = var.versioning_enabled
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  cors {
    origin          = var.cors_origins
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = merge(var.labels, {
    environment = var.environment
    purpose     = "car-images"
  })
}

# Cloud Storage bucket for static assets (CSS, JS, etc.)
resource "google_storage_bucket" "static_assets" {
  name          = "${var.environment}-static-assets-${random_id.bucket_suffix.hex}"
  project       = var.project_id
  location      = var.region
  storage_class = "STANDARD"

  uniform_bucket_level_access = true

  versioning {
    enabled = false
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  cors {
    origin          = var.cors_origins
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 86400
  }

  labels = merge(var.labels, {
    environment = var.environment
    purpose     = "static-assets"
  })
}

# Cloud Storage bucket for application backups
resource "google_storage_bucket" "backups" {
  name          = "${var.environment}-backups-${random_id.bucket_suffix.hex}"
  project       = var.project_id
  location      = var.region
  storage_class = "COLDLINE"

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type = "Delete"
    }
  }

  labels = merge(var.labels, {
    environment = var.environment
    purpose     = "backups"
  })
}

# IAM bindings for buckets
resource "google_storage_bucket_iam_binding" "car_images_public_read" {
  bucket = google_storage_bucket.car_images.name
  role   = "roles/storage.objectViewer"

  members = [
    "allUsers",
  ]
}

resource "google_storage_bucket_iam_binding" "static_assets_public_read" {
  bucket = google_storage_bucket.static_assets.name
  role   = "roles/storage.objectViewer"

  members = [
    "allUsers",
  ]
}

# Service account access to buckets
resource "google_storage_bucket_iam_binding" "app_service_account_access" {
  bucket = google_storage_bucket.car_images.name
  role   = "roles/storage.objectAdmin"

  members = [
    "serviceAccount:${var.app_service_account_email}",
  ]
}

resource "google_storage_bucket_iam_binding" "backup_service_account_access" {
  bucket = google_storage_bucket.backups.name
  role   = "roles/storage.objectAdmin"

  members = [
    "serviceAccount:${var.app_service_account_email}",
  ]
}