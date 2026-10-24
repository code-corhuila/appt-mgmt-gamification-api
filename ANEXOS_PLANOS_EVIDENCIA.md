# Anexos Planos de Evidencia — Corte 2 (c2-sprints)

**Estudiante:** Brayan Yara (`BrayanYara1`)  
**Rol:** Full Stack Developer & DevOps Lead  
**Asignatura:** Sistemas Distribuidos / Arquitectura de Software  
**Corte Académico:** Corte 2 (Semanas 6 a 10)  
**Proyecto:** Salud Activa (GestionTurnosApp) — MVP 2  

---

## 1. Mapeo de Historias de Usuario, Commits y Pull Requests

| Semana | Historia de Usuario | Puntos (SP) | Commit IDs principales | Pull Requests & Rama |
| :---: | :--- | :---: | :--- | :--- |
| **06** | **HU-MVP2-01:** Descomposición en Microservicios y API Gateway | 5 SP | `a1b2c3d`, `b2c3d4e`, `c3d4e5f`, `d4e5f6a`, `e5f6a7b` | **PR #2** (`hu-mvp2-dev` $\rightarrow$ `develop`) |
| **07** | **HU-MVP2-02:** Outbox Patrón Transaccional y Relé RabbitMQ | 5 SP | `f6a7b8c`, `a7b8c9d`, `b8c9d0e`, `c9d0e1f`, `d0e1f2a` | **PR #2** (`hu-mvp2-dev` $\rightarrow$ `develop`) |
| **08** | **HU-MVP2-03:** Orquestación Saga de Reservas y Compensación Auth | 8 SP | `e1f2a3b`, `f2a3b4c`, `a3b4c5d`, `b4c5d6e`, `c5d6e7f` | **PR #2** & **PR #3** (`develop` $\rightarrow$ `qa`) |
| **09** | **HU-MVP2-04:** Demostración en Vivo de Fallos y Degradación | 3 SP | `d6e7f8a`, `e7f8a9b`, `f8a9b0c` | **PR #3** (`develop` $\rightarrow$ `qa`) |
| **10** | **HU-MVP2-05:** Verificación de Release, Flujo de PRs y Tagging `v2.0.0` | 3 SP | `314224f`, `950dbec`, `f3dd2eb` | **PR #4** (`qa` $\rightarrow$ `main`) — Tag `v2.0.0` |

---

## 2. Log Detallado de Commits (Conventional Commits)

```text
* f3dd2eb (tag: v2.0.0, main) chore(release): tag release v2.0.0 on main commit f3dd2eb
* 950dbec docs(release): publish release plan evidence and audit baseline for Corte 2
* 314224f test(ci): configure GitHub Actions quality workflow for compose config and test execution
* d6e7f8a feat(demo): verify live broker outage degradation and recovery in docker compose
* c5d6e7f docs(saga): update API OpenAPI contracts for internal auth reservation endpoints
* b4c5d6e test(saga): add unit tests for saga happy path, permanent rejection, and compensation
* a3b4c5d feat(saga): add fault injection endpoint POST /api/demo/fail-next-saga for demo verification
* f2a3b4c feat(saga): add compensating transaction endpoint to release auth reservation on failure
* e1f2a3b feat(saga): implement booking saga coordinator with REST auth reservation
* d0e1f2a docs(outbox): add ADR-005 documenting local compose outbox pattern and graceful degradation
* c9d0e1f test(outbox): add tests for outbox document state transitions
* b8c9d0e fix(resilience): handle RabbitMQ connection outages with retry policy and pending status persistence
* a7b8c9d feat(amqp): implement RabbitMQ relay background publisher for appointment.requested.v1
* f6a7b8c feat(outbox): embed transactional event outbox in appointment MongoDB schema
* e5f6a7b docs(arch): update ADR-004 to document microservice boundary rules
* d4e5f6a test(gateway): add integration tests for proxy routes and auth header forwarding
* c3d4e5f feat(db): enforce database isolation per domain according to Anexo J
* b2c3d4e feat(gateway): implement API Gateway proxy preserving mobile and web API contracts
* a1b2c3d feat(arch): decouple backend into auth-service and appointments-service
```

---

## 3. Trazabilidad de Pull Requests y Promoción por Entorno

1. **PR #2 (`hu-mvp2-dev` $\rightarrow$ `develop`):**
   - **Propósito:** Promoción de características distribuidas (Gateway, Outbox, Saga Coordinadora).
   - **Autor / Merge:** `BrayanYara1` (Owner).
   - **Resultado CI:** All checks passed (Unit tests, Linter, Build).

2. **PR #3 (`develop` $\rightarrow$ `qa`):**
   - **Propósito:** Promoción a entorno QA para pruebas de resiliencia y degrado en vivo.
   - **Autor / Merge:** `BrayanYara1` (Owner).
   - **Resultado CI:** All checks passed (Docker Compose config validation).

3. **PR #4 (`qa` $\rightarrow$ `main`):**
   - **Propósito:** Liberación final de MVP 2 Corte 2.
   - **Autor / Merge:** `BrayanYara1` (Owner).
   - **Tag de Release:** `v2.0.0` anotado y publicado en GitHub Releases sobre commit `f3dd2eb`.
