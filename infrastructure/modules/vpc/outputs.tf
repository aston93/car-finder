# VPC Module Outputs

output "vpc_name" {
  description = "Name of the VPC"
  value       = google_compute_network.vpc.name
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = google_compute_network.vpc.id
}

output "gke_subnet_name" {
  description = "Name of the GKE subnet"
  value       = google_compute_subnetwork.gke_subnet.name
}

output "gke_subnet_id" {
  description = "ID of the GKE subnet"
  value       = google_compute_subnetwork.gke_subnet.id
}

output "db_subnet_name" {
  description = "Name of the database subnet"
  value       = google_compute_subnetwork.db_subnet.name
}

output "db_subnet_id" {
  description = "ID of the database subnet"
  value       = google_compute_subnetwork.db_subnet.id
}

output "pods_range_name" {
  description = "Name of the pods IP range"
  value       = google_compute_subnetwork.gke_subnet.secondary_ip_range[0].range_name
}

output "services_range_name" {
  description = "Name of the services IP range"
  value       = google_compute_subnetwork.gke_subnet.secondary_ip_range[1].range_name
}