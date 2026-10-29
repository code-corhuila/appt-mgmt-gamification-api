# ADR-C3-02: Managed Multi-AZ Document Persistence and Durable Event Messaging

## Status

Accepted

## Context

In MVP 2, **Salud Activa** relies on a single MongoDB 7.0 container instance for storing patient credentials (`SaludActiva_auth`) and appointment outbox collections (`SaludActiva_turnos`), alongside a single RabbitMQ container for handling asynchronous outbox events (`appointment.requested.v1`). For production cloud deployment, hosting stateful databases and event buses on single containers introduces critical single points of failure, risk of data loss during node outages, and unmanaged failover scenarios.

## Decision

We decided to adopt managed multi-AZ cloud database services (Document Database Service DDS / MongoDB Atlas) for document persistence and a managed dedicated RabbitMQ messaging cluster (Distributed Message Queue DMQ / Amazon MQ) for outbox event transport.

## Alternatives considered

1. **Self-Hosted Database & Broker Containers on Compute VMs:**  
   *Why Rejected:* Self-hosting MongoDB replica sets and RabbitMQ clusters on cloud virtual machines requires manual configuration of storage volume snapshots, manual failover script management, and continuous disk space monitoring.
2. **Serverless NoSQL (DynamoDB) + Managed SQS/SNS:**  
   *Why Rejected:* Requires a complete rewrite of all existing Mongoose data schemas, repository classes, and AMQP event publishing logic, violating our release schedule constraints.

## Consequences

* **Positive Consequences:**  
  * Preserves 100% code compatibility with our existing Node.js Mongoose models and RabbitMQ `amqplib` outbox relay implementation.  
  * Multi-AZ database replica sets deliver automated primary-to-secondary node failover within 30 seconds without data loss.  
  * Continuous automated database backups with point-in-time recovery meet our RPO < 5 minutes target.
* **Negative Consequences:**  
  * Provisioning dedicated managed database nodes and messaging clusters incurs fixed baseline hourly costs; mitigated by right-sizing cluster instances to small/medium tiers during initial deployment.
