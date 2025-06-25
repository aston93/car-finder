# VPC Module for Car Finder Platform

resource "google_compute_network" "vpc" {
  name                    = "${var.environment}-vpc"
  project                 = var.project_id
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "gke_subnet" {
  name          = "${var.environment}-gke-subnet"
  project       = var.project_id
  ip_cidr_range = var.gke_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id

  secondary_ip_range {
    range_name    = "${var.environment}-pods"
    ip_cidr_range = var.pods_cidr
  }

  secondary_ip_range {
    range_name    = "${var.environment}-services"
    ip_cidr_range = var.services_cidr
  }
}

resource "google_compute_subnetwork" "db_subnet" {
  name          = "${var.environment}-db-subnet"
  project       = var.project_id
  ip_cidr_range = var.db_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
}

# Cloud NAT for outbound internet access
resource "google_compute_router" "router" {
  name    = "${var.environment}-router"
  project = var.project_id
  region  = var.region
  network = google_compute_network.vpc.id
}

resource "google_compute_router_nat" "nat" {
  name    = "${var.environment}-nat"
  project = var.project_id
  router  = google_compute_router.router.name
  region  = var.region

  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Firewall rules
resource "google_compute_firewall" "allow_internal" {
  name    = "${var.environment}-allow-internal"
  project = var.project_id
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = [
    var.gke_subnet_cidr,
    var.db_subnet_cidr,
    var.pods_cidr,
    var.services_cidr
  ]
}

resource "google_compute_firewall" "allow_health_check" {
  name    = "${var.environment}-allow-health-check"
  project = var.project_id
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
  }

  source_ranges = ["130.211.0.0/22", "35.191.0.0/16"]
  target_tags   = ["gke-node"]
}