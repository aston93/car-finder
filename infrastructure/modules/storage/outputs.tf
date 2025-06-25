# Storage Module Outputs

output "car_images_bucket_name" {
  description = "Name of the car images bucket"
  value       = google_storage_bucket.car_images.name
}

output "car_images_bucket_url" {
  description = "URL of the car images bucket"
  value       = google_storage_bucket.car_images.url
}

output "static_assets_bucket_name" {
  description = "Name of the static assets bucket"
  value       = google_storage_bucket.static_assets.name
}

output "static_assets_bucket_url" {
  description = "URL of the static assets bucket"
  value       = google_storage_bucket.static_assets.url
}

output "backups_bucket_name" {
  description = "Name of the backups bucket"
  value       = google_storage_bucket.backups.name
}

output "backups_bucket_url" {
  description = "URL of the backups bucket"
  value       = google_storage_bucket.backups.url
}