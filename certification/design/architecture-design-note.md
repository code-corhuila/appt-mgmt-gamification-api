# Architecture design note — Salud Activa

> **System Name:** Salud Activa — Distributed Medical Appointment Platform  
> **Author:** Brayan Yara (`@BrayanYara1`) — Full Stack & DevOps Lead  
> **Date:** November 2026  
> **Course:** Distributed Systems 2026-B · Corte 3 Certification

---

## 1. Target architecture

The cloud target architecture transforms the **Salud Activa** ecosystem from a local containerized deployment into an enterprise-grade, highly available, multi-Availability Zone (AZ) cloud infrastructure hosted on Huawei Cloud / AWS. The system isolates public ingress from private internal container workloads and persistence tiers using multi-tier Virtual Private Cloud (VPC) subnets across two independent Availability Zones (AZ-1 and AZ-2).

![Target architecture](target-architecture.png)

### Mapping of Diagram Components to Architecture Documentation
* **API Gateway (`backend:3000`):** Hosted on Cloud Container Engine (CCE) Serverless tasks across AZ-1 and AZ-2 public subnets behind an Elastic Load Balance (ELB) listener. Defined in [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#service-catalog) and [`docs/05-architecture/pattern-guide.md`](../../docs/05-architecture/pattern-guide.md).
* **Auth Service (`auth-service:3001`):** Deployed as isolated microservice tasks in private application subnets across AZ-1 and AZ-2, owning identity validation and user session state. Defined in [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#service-catalog).
* **Appointments Service (`appointments-service:3002`):** Deployed as decoupled CCE container pods across private application subnets, coordinating appointment reservations and managing the Transactional Outbox pattern. Defined in [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#distributed-booking-flow).
* **MongoDB Persistence Layer (`SaludActiva_auth` & `SaludActiva_turnos`):** Provisioned as a multi-AZ Managed DocumentDB / DDS Replica Set across private database subnets with primary node in AZ-1 and automated standby replica in AZ-2. Defined in [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#service-catalog).
* **RabbitMQ Message Broker (`rabbitmq:5672`):** Hosted as a managed Distributed Message Queue (DMQ) cluster with mirrored queues across AZ-1 and AZ-2 for durable outbox event relaying (`appointment.requested.v1`). Defined in [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#distributed-booking-flow).

---

## 2. Five principles

The table below evaluates the architectural weaknesses of the local MVP 2 setup against the five cloud design principles, documenting concrete design decisions and cloud services used to mitigate them.

| Principle | Current weakness | Evidence in -docs | Design decision | Huawei Cloud service |
| :--- | :--- | :--- | :--- | :--- |
| **Reliability** | Single point of failure in standalone MongoDB container causing unhandled 500 errors during transient database network drops. | [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#system-architecture-overview) | Deploy a multi-AZ primary-secondary database replica set with automatic healthchecks and failover within 30 seconds. | Document Database Service (DDS) / Managed Mongo |
| **Security** | API Gateway routes lack strict rate-limiting and payload schema validation at the public edge perimeter. | [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#architectural-principles) | Implement Web Application Firewall (WAF) rule sets and TLS 1.3 encryption for all public client ingress traffic. | Web Application Firewall (WAF) & ELB |
| **Performance efficiency** | Fixed single-instance container allocation cannot dynamic scale during morning medical appointment booking traffic spikes. | [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#adopted-architectural-style) | Enforce CPU and request-based metric auto-scaling policies to horizontally scale container pods on demand. | Cloud Container Engine (CCE) Auto-scaler |
| **Cost** | Fixed server provisioning consumes constant computing resources during zero-traffic night hours. | [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#service-catalog) | Utilize serverless container tasks and schedule automated off-peak container pod scale-down policies. | Cloud Container Engine (CCE) Serverless |
| **Operations** | Centralized application logs rely on local container console stdout outputs without automated alerting. | [`docs/05-architecture/overview.md`](../../docs/05-architecture/overview.md#architectural-principles) | Implement centralized structured JSON log aggregation with automated metric alarms and fast-burn alerts. | Application Operations Management (AOM) |

---

## 3. Scalability

To guarantee high availability and sub-second response times during peak patient booking periods, horizontal pod auto-scaling policies are established for core backend microservices.

### Service 1: `appointments-service`
* **Trigger Metric:** Average Container vCPU Utilization.
* **Scaling Threshold:** CPU utilization exceeding `70%` for longer than `60 seconds`.
* **Instance Limits:** Minimum instance count: `2 pods` (distributed across AZ-1 and AZ-2); Maximum instance count: `12 pods`.
* **Scale-Down Policy:** CPU utilization dropping below `25%` for `300 seconds` triggers gradual termination of 1 pod per 2 minutes.

### Service 2: `auth-service`
* **Trigger Metric:** Concurrent Inbound HTTP Request Count.
* **Scaling Threshold:** Inbound request rate exceeding `150 requests/second` per container instance.
* **Instance Limits:** Minimum instance count: `2 pods`; Maximum instance count: `10 pods`.
* **Scale-Down Policy:** Request rate dropping below `30 requests/second` for `180 seconds` triggers pod consolidation.

---

## 4. Disaster Recovery

Medical records and appointment bookings in `SaludActiva_turnos` represent critical healthcare data subject to strict availability and durability SLOs.

* **Target Recovery Objectives:**
  * **RPO (Recovery Point Objective):** `< 5 minutes` (Maximum acceptable data loss window).
  * **RTO (Recovery Time Objective):** `< 15 minutes` (Maximum acceptable service outage duration).
* **Chosen DR Pattern:** **Warm Standby / Multi-AZ Active-Passive Failover Pattern** (Chapter 11 Methodology).
* **Verification Proof:** The chosen Warm Standby pattern maintains an active, fully provisioned secondary database replica in AZ-2 continuously synchronized via real-time oplog replication from the primary node in AZ-1. Because oplog streaming occurs synchronously with a commit lag under 2 seconds, the RPO target of 5 minutes is strictly satisfied. In the event of a catastrophic failure in AZ-1, automated DNS healthchecks trigger failover to the secondary node within 45 seconds, comfortably meeting the 15-minute RTO requirement.

---

## 5. Automated Deployment

The CI/CD deployment pipeline automates code quality gates, container image building, vulnerability scanning, staging verification, zero-downtime rolling updates, and automated rollback triggers.

| Stage | Trigger | Tool or service | File in your team's repositories |
| :--- | :--- | :--- | :--- |
| **1. Build** | Push to feature branch or PR open | GitHub Actions / Node.js build runner | `.github/workflows/ci.yml` |
| **2. Test** | Pull request created to `develop` | Jest Unit & Integration Test Suite | `backend/__tests__/auth-negative.test.js` |
| **3. Image** | Merge to `develop` or `main` | Docker Engine / Software Repository for Container (SWR) | `backend/Dockerfile` |
| **4. Deploy to QA** | Automatic merge to `qa` branch | Cloud Container Engine (CCE) Deployment Rolling Upgrade | `.github/workflows/deploy-qa.yml` |
| **5. Deploy to Production** | Tag release `v*.*.*` or merge to `main` | Elastic Load Balance (ELB) Canary / Blue-Green Switch | `.github/workflows/deploy-prod.yml` |
| **6. Rollback** | Automated CCE container healthcheck failure | CCE Automated Rolling Rollback & Helm Release Revert | `.github/workflows/rollback.yml` |

---

## 6. Decisions

* **ADR-C3-01:** Serverless Container Compute Selection for Elastic Workloads — [`ADR-C3-01.md`](ADR-C3-01.md)
* **ADR-C3-02:** Managed Multi-AZ Document Persistence and Durable Messaging Bus — [`ADR-C3-02.md`](ADR-C3-02.md)
