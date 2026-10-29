# ADR-001: Selection of Serverless Container Compute for Cloud Deployment

> **Status:** Accepted  
> **Date:** October 2026  
> **Authors:** Brayan Yara (`@BrayanYara1`) — Full Stack & DevOps Lead  
> **Deciders:** Distributed Systems Architecture Team

---

## 1. Context & Problem Statement

The **Salud Activa** backend consists of Node.js microservices (`backend` gateway, `auth-service`, and `appointments-service`). In local environments, these run via Docker Compose. As we transition to cloud infrastructure, we require a container orchestration platform that provides high availability across multiple Availability Zones, automated horizontal scaling, and minimal operational maintenance overhead for server management.

---

## 2. Decision Drivers

* **Operational Overhead:** Minimizing virtual machine (EC2/ECS host) provisioning, OS patching, and capacity planning.
* **Elastic Auto-Scaling:** Ability to scale container instances rapidly from low traffic to peak patient appointment booking hours.
* **Security & Isolation:** Enforcing dedicated networking isolation per container task within private subnets.
* **Cost Efficiency:** Pay-per-use billing model based on exact vCPU and RAM consumed per second.

---

## 3. Considered Options

1. **Option 1: Self-Managed Virtual Machines (EC2 / Compute Instances with Docker Compose)**  
   *Pros:* Full control over OS kernel and Docker settings.  
   *Cons:* High operational burden, manual OS patching, complex auto-scaling setup.
2. **Option 2: Serverless Container Engine (ECS Fargate / Cloud Container Engine CCE Serverless)**  
   *Pros:* Zero server management, automated multi-AZ task distribution, native auto-scaling policies, granular resource billing.  
   *Cons:* Slightly higher cost per unit compared to reserved full-time VMs at maximum load.
3. **Option 3: Full Kubernetes Cluster (EKS / CCE Full Cluster)**  
   *Pros:* Highly customizable Kubernetes API ecosystem.  
   *Cons:* Over-engineered for current 3-microservice architecture, significant control-plane management costs.

---

## 4. Decision Outcome

**Chosen Option:** **Option 2 (Serverless Container Engine — ECS Fargate / CCE Serverless)**.

### Rationale:
Serverless container execution satisfies all operational drivers. It eliminates infrastructure maintenance while delivering automated multi-AZ redundancy for `auth-service` and `appointments-service`. The container tasks run in isolated private subnets attached to Elastic Network Interfaces (ENIs).

---

## 5. Consequences

* **Positive Impacts:**
  * Eliminates underlying OS maintenance and security patching tasks.
  * Container tasks scale horizontally based on target CPU utilization (60%) and HTTP request thresholds.
  * Native integration with Application Load Balancers (ALB) and CloudWatch structured logging.
* **Negative Impacts & Risks:**
  * Cold start latency penalty (~3 seconds) when spinning up initial new tasks during sharp traffic spikes; mitigated by maintaining a minimum baseline of 2 running tasks per service across Availability Zones.
