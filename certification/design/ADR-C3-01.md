# ADR-C3-01: Selection of Serverless Container Compute for Cloud Workloads

## Status

Accepted

## Context

The **Salud Activa** backend architecture consists of Node.js microservices (`backend` gateway, `auth-service`, and `appointments-service`). In local development, these workloads run inside standalone Docker containers using Docker Compose. When migrating to cloud infrastructure, we require a container orchestration execution platform capable of delivering multi-AZ high availability, automated pod scaling during morning appointment traffic surges, and minimal operational maintenance overhead for virtual machine management.

## Decision

We decided to adopt a serverless container execution platform (Cloud Container Engine CCE Serverless / AWS ECS Fargate) to host all backend microservices across two Availability Zones (AZ-1 and AZ-2).

## Alternatives considered

1. **Self-Managed Virtual Machines (ECS on EC2 / Compute Instances with Docker Compose):**  
   *Why Rejected:* Requires manual OS patching, security kernel updates, and complex custom auto-scaling scripts. The operational burden of managing server hosts conflicts with our team's focus on microservice feature delivery.
2. **Dedicated Full Kubernetes Cluster (CCE Full Cluster / EKS):**  
   *Why Rejected:* Introducing full Kubernetes cluster control-plane management introduces excessive architectural complexity and fixed monthly control-plane overhead that is over-engineered for our 3-microservice ecosystem.

## Consequences

* **Positive Consequences:**  
  * Completely eliminates host OS provisioning, security patching, and virtual machine capacity management.  
  * Native horizontal auto-scaling dynamically adjusts container task replicas based on CPU utilization and request rates.  
  * Containers run in isolated private subnets with ENI attachment, protecting application workloads from public Internet exposure.
* **Negative Consequences:**  
  * Cold start latency penalty (~3 seconds) when spinning up new serverless container tasks during extreme traffic spikes; mitigated by maintaining a minimum baseline of 2 running tasks per service across Availability Zones.
