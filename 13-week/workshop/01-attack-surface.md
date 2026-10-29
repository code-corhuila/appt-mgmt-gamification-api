# CP1 — Attack Surface Map & Trust Boundaries

> **Author:** Brayan Yara (`@BrayanYara1`)  
> **System:** Salud Activa Ecosystem  
> **Claimed Trust Boundary:** `TB1: External Client (Android App) -> API Gateway (backend:3000)`

---

## 1. System Data Flow Diagram (DFD)

The diagram below maps all active services, message brokers, data stores, and external client entry points within the **Salud Activa** architecture. Trust boundaries are marked where data transitions between security zones.

```mermaid
graph TB
    subgraph UntrustedZone["Untrusted Network Zone (Public Internet)"]
        Client["Android Mobile Client<br/>(MVVM Kotlin / Room DB)"]
    end

    subgraph BoundaryTB1["Trust Boundary TB1 (TLS/HTTP Internet Perimeter)"]
        Gateway["API Gateway<br/>(backend:3000 / Node.js Express)"]
    end

    subgraph TrustedInternalZone["Trusted Internal Microservices Zone (Docker Network)"]
        subgraph BoundaryTB2["Trust Boundary TB2 (Intra-Service REST)"]
            AuthService["Auth Service<br/>(auth-service:3001)"]
        end

        subgraph BoundaryTB5["Trust Boundary TB5 (Saga REST Contract)"]
            ApptService["Appointments Service<br/>(appointments-service:3002)"]
        end

        subgraph BoundaryTB4["Trust Boundary TB4 (Event Broker Bus)"]
            RabbitMQ["RabbitMQ Broker<br/>(rabbitmq:5672)"]
        end

        subgraph BoundaryTB3["Trust Boundary TB3 (Persistence Layer)"]
            MongoDB[(MongoDB Cluster<br/>mongodb:27017<br/>SaludActiva_auth / SaludActiva_turnos)]
        end
    end

    Client -- "HTTPS / JWT<br/>POST /api/auth/login<br/>POST /api/turnos" --> Gateway
    Gateway -- "Internal REST<br/>/api/auth/*" --> AuthService
    Gateway -- "Internal REST<br/>/api/turnos/*" --> ApptService
    
    ApptService -- "Saga Event Outbox<br/>appointment.requested.v1" --> RabbitMQ
    RabbitMQ -- "Saga Consume" --> ApptService
    ApptService -- "Reserve Slot REST" --> AuthService
    
    AuthService -- "Read/Write Users" --> MongoDB
    ApptService -- "Read/Write Turnos & Outbox" --> MongoDB

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Gateway fill:#bbf,stroke:#333,stroke-width:3px
    style BoundaryTB1 stroke:#f00,stroke-width:3px,stroke-dasharray: 5 5
```

---

## 2. Domain Asset Inventory

The table below classifies the primary domain assets handled by **Salud Activa** according to sensitivity and exposure.

| Asset ID | Asset Name | Description & Storage Location | Classification | Sensitivity Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **AST-01** | User Credentials & Password Hashes | Argon2/Bcrypt password hashes stored in `SaludActiva_auth.users` MongoDB collection. | **Restricted** | Compromise leads to account takeover of patient medical records. |
| **AST-02** | JWT Bearer Tokens | Signed HS256 tokens issued by `auth-service` and cached in Android `EncryptedSharedPreferences`. | **Confidential** | Grants full API authorization to perform booking and profile management. |
| **AST-03** | Medical Appointment Records (`Turnos`) | Appointment details (patient ID, specialty, date, status) in `SaludActiva_turnos.turnos`. | **Confidential** | Patient Health Information (PHI) subject to statutory healthcare privacy regulation. |
| **AST-04** | Patient Health Records & Symptoms | Diagnostic logs and symptom history in `SaludActiva_health.records` and Android Room DB. | **Confidential** | Highly personal diagnostic data requiring strict confidentiality controls. |
| **AST-05** | Internal Service Pre-Shared Tokens | `SERVICE_TOKEN` environment variables used for gateway-to-service authentication. | **Restricted** | Allows bypassing client authentication if exposed publicly or logged. |

---

## 3. Entry Points Inventory for Claimed Boundary (TB1)

`TB1` represents the public perimeter exposed by the API Gateway (`backend:3000`). All client requests cross this boundary from untrusted mobile networks.

| Endpoint / Target | HTTP Method | Expected Payload / Params | Current Authentication | Primary Risk Vectors |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | `{ email, password }` | Public (Unauthenticated) | Brute-force credential stuffing, SQL/NoSQL injection, DoS. |
| `/api/auth/register` | `POST` | `{ nombre, email, password, dni }` | Public (Unauthenticated) | Fake account creation, resource exhaustion, duplicate DNI probing. |
| `/api/turnos` | `POST` | `{ especialidad, fecha, medicoId }` | Bearer JWT Header (`Authorization`) | Token theft, parameter manipulation, booking race conditions. |
| `/api/turnos/usuario/:id` | `GET` | URL Parameter (`id`) | Bearer JWT Header (`Authorization`) | Broken Object Level Authorization (BOLA/IDOR), data leakage. |
| `/health/live` | `GET` | None | Public (Unauthenticated) | Reconnaissance, system fingerprinting, amplification attacks. |

---

## 4. Reflection Log (CP1)

### What I learned that I didn't know before:
I learned that mapping trust boundaries requires explicitly identifying where data crosses between different security control zones, rather than just drawing component diagrams. Differentiating between client-to-gateway perimeter boundaries and internal service-to-service transport is essential for threat modeling.

### How it applies to my project (Salud Activa):
In Salud Activa, the mobile app interacts with the Node.js API Gateway over `TB1`. While internal microservices (`auth-service` and `appointments-service`) reside in a Docker bridge network, `TB1` is publicly accessible and handles sensitive HTTP requests carrying JWT tokens and PHI appointment payloads.

### What I would fix first in the team's real code and what prevents it today:
I would implement strict payload validation schemas (such as Zod or Joi) at the Gateway entry point (`backend/server.js`). Today, raw JSON bodies are forwarded directly to microservices, creating potential parameter tampering risks.
