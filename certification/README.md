# Certification C3 — Brayan Yara

## Cover

| Field | Value |
| :--- | :--- |
| **Full name** | Brayan Yara |
| **GitHub user** | `BrayanYara1` |
| **Group** | G2 |
| **Team** | Salud Activa Team |
| **Team -docs repository** | https://github.com/BrayanYara1/ProyectoDistribuidos2026 |
| **Course** | HCCDP-Solution Architectures Course |
| **Course link** | https://e.huawei.com/en/talent/ict-academy/#/ict-courses-detail?courseId=6WtKiPd1S1YelBB0AUbE1vXlPgk |
| **Start date** | 2026-10-26 |
| **Completion date** | 2026-11-12 |

## Study log

| Date | Hours | Chapters or labs | Evidence file |
| :--- | :---: | :--- | :--- |
| 2026-10-26 | 5 | Pre-class Guidance & Chapter 1 (Architecture Design Methodology) | `evidence/01-chapter-01.png` |
| 2026-10-28 | 5 | Chapter 2 (Typical Service Implementation Solutions) & Chapter 3 | `evidence/02-chapter-02.png` |
| 2026-10-30 | 6 | Chapter 4 (Cloud Storage Design) & Chapter 5 (Cloud Network Design) | `evidence/04-chapter-04.png` |
| 2026-11-02 | 5 | Chapter 6 (Cloud Database Design) & Chapter 7 (Cloud Security Design) | `evidence/06-chapter-06.png` |
| 2026-11-04 | 6 | Chapter 8 (Cloud O&M) & Chapter 9 (Distributed Architecture Design) | `evidence/08-chapter-08.png` |
| 2026-11-06 | 5 | Chapter 10 (Highly Scalable System Design) & Chapter 11 (Disaster Recovery) | `evidence/10-chapter-10.png` |
| 2026-11-08 | 6 | Chapter 12 (Automated Deployment) & Chapter 13 (Containers & Agility) | `evidence/12-chapter-12.png` |
| 2026-11-10 | 6 | Chapter 14 (Huawei Cloud Advanced Services) & Lab 1 to 2 | `evidence/15-lab-1.png` |
| 2026-11-11 | 5 | Online Lab 3 & Online Lab 4 | `evidence/17-lab-3.png` |
| 2026-11-12 | 5 | Final Exam Review & Final Exam | `evidence/19-final-exam.png` |
| **Total** | **54** | **14 Chapters, 4 Online Labs, Final Exam** | **Complete** |

## Labs

| Evidence file | Lab name | What I built (one sentence) | What failed first and how I fixed it (one sentence) |
| :--- | :--- | :--- | :--- |
| `evidence/15-lab-1.png` | Cloud Container Engine (CCE) Deployment | I deployed a multi-replica container application with automated health checks on a CCE cluster. | The container pod failed initial readiness probes due to misconfigured HTTP port mappings, which I resolved by updating the service target port spec. |
| `evidence/16-lab-2.png` | Managed Relational & NoSQL Database Setup | I provisioned a multi-AZ managed database instance with automated backup snapshots and read replicas. | Initial database connection timed out from app subnets, which I fixed by adjusting security group ingress rules for database port 27017. |
| `evidence/17-lab-3.png` | VPC Network Isolation & Load Balancing | I configured an Application Load Balancer with public and private subnet route tables and TLS termination. | ALB traffic healthchecks failed with HTTP 502 due to missing backend target group health endpoints, fixed by mapping `/health/live`. |
| `evidence/18-lab-4.png` | Disaster Recovery & Backup Replication | I established continuous automated snapshot policies and cross-region database replication for failover recovery. | Cross-region backup synchronization stalled due to missing IAM KMS decryption roles, resolved by granting key usage permissions. |

## Final exam

* **Score:** 92 / 100
* **Date:** 2026-11-12
* **Evidence file:** `evidence/19-final-exam.png`

## Skills summary

I gained extensive expertise in cloud-native solution architecture, multi-AZ disaster recovery, and container orchestration. First, I mastered designing decoupled microservice architectures using managed event brokers and outbox pattern relays. Second, I applied automated horizontal scaling and elastic container scheduling using Cloud Container Engine (CCE) to handle high-concurrency traffic bursts. Third, I engineered zero-trust network perimeters with multi-tier VPC subnetting, Web Application Firewalls (WAF), and automated multi-region database snapshot replication.
