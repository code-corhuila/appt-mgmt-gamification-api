# ADR-002: Managed Multi-AZ Document Persistence and Durable Messaging Bus

> **Status:** Accepted  
> **Date:** October 2026  
> **Authors:** Brayan Yara (`@BrayanYara1`) — Full Stack & DevOps Lead  
> **Deciders:** Distributed Systems Architecture Team

---

## 1. Context & Problem Statement

In MVP 2, **Salud Activa** utilizes a single MongoDB 7.0 container instance for `SaludActiva_auth` and `SaludActiva_turnos`, alongside a standalone RabbitMQ container for asynchronous appointment outbox events (`appointment.requested.v1`). For cloud deployment, self-hosting stateful databases on single containers presents unacceptable risks of data loss, storage corruption, and unmanaged failovers. We require managed cloud database and messaging services.

---

## 2. Decision Drivers

* **Data Durability & High Availability:** Multi-AZ replication with automatic failover for patient records and appointment outbox collections.
* **Automated Backups & Point-In-Time Recovery:** Continuous backup policies enabling RPO < 5 minutes.
* **Message Ordering & Exactly-Once Semantics:** Guaranteeing that outbox event publishing (`appointment.requested.v1`) delivers reliable saga coordination without duplicate bookings.
* **Encryption at Rest & In Transit:** Enforcing TLS 1.3 for data in transit and KMS storage encryption for PHI compliance.

---

## 3. Considered Options

1. **Option 1: Managed MongoDB Cluster (MongoDB Atlas / Managed DocumentDB)** + **Managed RabbitMQ (Amazon MQ / Distributed MQ)**  
   *Pros:* Full compatibility with existing Mongoose schemas and `amqplib` microservice code; multi-AZ automated failover.  
   *Cons:* Managed broker services carry fixed hourly cluster costs.
2. **Option 2: Self-Managed MongoDB & RabbitMQ on Cloud Compute Instances**  
   *Pros:* Cheaper raw infrastructure cost.  
   *Cons:* Requires manual management of primary-secondary failover, disk volume snapshots, and RabbitMQ queue clustering.
3. **Option 3: Migration to Managed DynamoDB + SQS/SNS**  
   *Pros:* Fully serverless data layer.  
   *Cons:* Requires complete rewrite of Mongoose schemas, queries, and Outbox relay logic; violates sprint deadline constraints.

---

## 4. Decision Outcome

**Chosen Option:** **Option 1 (Managed MongoDB Cluster + Managed Dedicated RabbitMQ Bus)**.

### Rationale:
Option 1 preserves 100% backwards compatibility with our existing Node.js Mongoose code and AMQP outbox relay architecture while providing cloud-managed multi-AZ durability, automated storage auto-expansion, and KMS encryption.

---

## 5. Consequences

* **Positive Impacts:**
  * Zero code rewrites required for `auth-service` or `appointments-service` database drivers.
  * Multi-AZ replica set provides automatic failover within 30 seconds if a primary database node fails.
  * Encrypted storage at rest satisfies healthcare privacy regulatory requirements for patient PHI.
* **Negative Impacts & Risks:**
  * Fixed monthly cluster baseline cost for managed RabbitMQ and MongoDB nodes; mitigated by right-sizing initial cluster instances to small/medium tiers during MVP deployment.
