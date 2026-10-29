# CP3 & CP7 — Security Backlog & Refined User Stories

> **Author:** Brayan Yara (`@BrayanYara1`)  
> **System:** Salud Activa Ecosystem  
> **Target Release:** Sprint Security Backlog (MVP 2 Closeout & Refinement)

---

## Security User Story 1 (Priority P0 — Highest Risk)

### Title: `[security] Implement IP and User Rate Limiting on Authentication and Turnos Endpoints`

* **STRIDE Category:** Denial of Service (D)
* **Risk Score:** 9 (Critical) — Likelihood: 3, Impact: 3
* **Target PR:** `https://github.com/BrayanYara1/ProyectoDistribuidos2026/pull/1`

#### Story Description:
**As a** Lead DevOps & Security Engineer,  
**I want to** enforce automated rate limiting on public gateway endpoints (`POST /api/auth/login` and `POST /api/turnos`),  
**So that** malicious automated traffic cannot exhaust backend server thread pools or flood the database with fake booking requests.

#### Acceptance Criteria:
1. **AC1 (Functional):** The API Gateway MUST return `429 Too Many Requests` with a JSON payload `{ "error": "Too many requests, please try again later." }` when an IP address exceeds 10 request attempts within a 1-minute window on `/api/auth/login`.
2. **AC2 (Automated Test):** **[B]** An automated integration test MUST simulate 11 consecutive HTTP POST requests to `/api/auth/login` from a single IP address and assert that request #11 receives HTTP status `429` (Bishop, 2019, p. 515).

---

## Security User Story 2 (Priority P1)

### Title: `[security] Implement Role-Based Access Control (RBAC) and Scope Verification Middleware`

* **STRIDE Category:** Elevation of Privilege (E) / Spoofing (S)
* **Risk Score:** 6 (High) — Likelihood: 2, Impact: 3
* **Target PR:** `https://github.com/BrayanYara1/ProyectoDistribuidos2026/pull/1`

#### Story Description:
**As a** System Architect,  
**I want to** verify explicit role claims (`role: patient`, `role: doctor`, `role: admin`) in JWT tokens at the API Gateway layer,  
**So that** unprivileged patient accounts cannot execute administrative routes or tamper with other patients' medical appointments.

#### Acceptance Criteria:
1. **AC1 (Functional):** The API Gateway middleware MUST extract the `role` claim from the incoming JWT token and reject any request to `/api/turnos` attempting to access or modify data belonging to a different `pacienteId` unless the caller has `role: admin`.
2. **AC2 (Automated Test):** An automated negative integration test MUST issue a `POST /api/turnos` request carrying a valid JWT token with `role: patient` but targeting an administrative path and verify that the Gateway returns HTTP `403 Forbidden`.

---

## Security User Story 3 (Priority P1)

### Title: `[security] Implement Payload Schema Validation and Cryptographic Parameter Binding`

* **STRIDE Category:** Tampering (T)
* **Risk Score:** 6 (High) — Likelihood: 2, Impact: 3
* **Target PR:** `https://github.com/BrayanYara1/ProyectoDistribuidos2026/pull/1`

#### Story Description:
**As a** Backend Developer,  
**I want to** enforce strict request payload schema validation on all incoming JSON request bodies at the Gateway before forwarding to microservices,  
**So that** malformed or injected data parameters cannot alter medical appointment state in `appointments-service`.

#### Acceptance Criteria:
1. **AC1 (Functional):** The API Gateway MUST validate all `POST /api/turnos` request bodies against a strict schema (verifying ISO 8601 date formatting, valid specialty ID strings, and positive numerical medical IDs) and reject invalid payloads with HTTP `400 Bad Request`.
2. **AC2 (Automated Test):** An automated API test MUST submit a payload containing invalid date strings or malicious extra attributes and assert that the gateway responds with HTTP `400` without passing the request downstream.
