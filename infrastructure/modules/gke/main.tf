# GKE Module for Car Finder Platform

resource "google_container_cluster" "primary" {
  name     = "${var.environment}-gke-cluster"
  project  = var.project_id
  location = var.zone

  # Network configuration
  network    = var.vpc_id
  subnetwork = var.subnet_id

  # IP allocation policy for secondary ranges
  ip_allocation_policy {
    cluster_secondary_range_name  = var.pods_range_name
    services_secondary_range_name = var.services_range_name
  }

  # Disable default node pool (we'll create our own)
  remove_default_node_pool = true
  initial_node_count       = 1

  # Master authorized networks (optional - for security)
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0"
      display_name = "All networks"
    }
  }

  # Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Enable network policy
  network_policy {
    enabled = true
  }

  addons_config {
    network_policy_config {
      disabled = false
    }
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
  }

  # Logging and monitoring
  logging_service    = "logging.googleapis.com/kubernetes"
  monitoring_service = "monitoring.googleapis.com/kubernetes"

  # Maintenance policy
  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }

  resource_labels = merge(var.labels, {
    environment = var.environment
  })
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.environment}-node-pool"
  project    = var.project_id
  location   = var.zone
  cluster    = google_container_cluster.primary.name
  node_count = var.node_count

  node_config {
    preemptible  = var.preemptible_nodes
    machine_type = var.machine_type

    # Service account for nodes
    service_account = var.service_account_email

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = merge(var.labels, {
      environment = var.environment
    })

    tags = ["gke-node"]

    # Workload Identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    disk_size_gb = var.disk_size_gb
    disk_type    = "pd-standard"
    image_type   = "COS_CONTAINERD"
  }

  # Auto-scaling configuration
  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }

  # Node management
  management {
    auto_repair  = true
    auto_upgrade = true
  }

  upgrade_settings {
    max_surge       = 1
    max_unavailable = 0
  }
}

# Artifact Registry for container images
resource "google_artifact_registry_repository" "repo" {
  location      = var.region
  project       = var.project_id
  repository_id = "${var.environment}-containers"
  description   = "Container registry for ${var.environment} environment"
  format        = "DOCKER"

  labels = merge(var.labels, {
    environment = var.environment
  })
}