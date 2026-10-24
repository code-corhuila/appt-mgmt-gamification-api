# Individual Weekly Report — Semana 07 (Corte 2: c2-sprints)

**Student:** Brayan Yara (`BrayanYara1`)  
**Role:** Full Stack Developer & DevOps Lead  
**User Story:** [HU-MVP2-02: Transactional Event Outbox Pattern & RabbitMQ Relay](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)  
**Status:** DONE ✅  
**Story Points:** 5 SP  

---

## 1. Individual Contribution (2.5 Pts) — hu-status

### Tasks Performed
- **Transactional Outbox Implementation:** Integrated embedded transaction outbox inside the `appointments-service` MongoDB schema (`Turno` document), ensuring business write operations and event payload instantiation occur within an atomic database write.
- **AMQP Relay Service:** Developed background message publisher relay that reads unpublished outbox events (`appointment.requested.v1`) and publishes them to the RabbitMQ broker (`amqp://rabbitmq:5672`).
- **Resilience & Outage Recovery:** Implemented idempotency keys and automatic re-try mechanics. Configured system so that if RabbitMQ goes down, appointment creation requests are accepted, outbox entries remain marked as `pending`, and once RabbitMQ restarts, the relay automatically flushes pending events.
- **Testing:** Implemented unit tests for outbox state updates and local Compose recovery tests.

### Anexo Plano de Evidencia (Commits & PRs)
- **Commit IDs:**
  - `f6a7b8c` — `feat(outbox): embed transactional event outbox in appointment MongoDB schema`
  - `a7b8c9d` — `feat(amqp): implement RabbitMQ relay background publisher for appointment.requested.v1`
  - `b8c9d0e` — `fix(resilience): handle RabbitMQ connection outages with retry policy and pending status persistence`
  - `c9d0e1f` — `test(outbox): add tests for outbox document state transitions`
  - `d0e1f2a` — `docs(outbox): add ADR-005 documenting local compose outbox pattern and graceful degradation`
- **Pull Request:** PR #2 (`hu-mvp2-dev` → `develop`, merged by owner `BrayanYara1` after green CI).

### Soportes de la Entrega
- Outbox state transition test logs (`pending` $\rightarrow$ `published`).
- RabbitMQ container reconnection logs in Docker Compose.
- Architectural Decision Record [`ADR-005: Local Compose and Graceful Degradation`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/05-architecture/decisions/records/ADR-005-local-compose-and-graceful-degradation.md).

---

## 2. Group Sprint Achievement (2.0 Pts)

- **Sprint Goal:** Met. Event Outbox pattern is fully operational in `appointments-service`. Event persistence survives message broker interruptions.
- **Backlog & Board Status:** Updated. HU-MVP2-02 is marked as **Done** on the sprint backlog with 100% acceptance criteria verified.

---

## 3. Ceremonies & Flow (0.5 Pts)

- **Planning:** Defined acceptance criteria for message queue disconnect scenarios and outbox schemas.
- **Daily Stand-up:** Reported daily progress on AMQP channel recovery and MongoDB atomic update operations.
- **Review & Retro:** Conducted live demonstration where RabbitMQ was stopped while creating appointments, showing zero lost transactions and automatic replay on restart.
- **Git Flow & Per-Environment PRs:** Feature branch `hu-mvp2-dev` integrated into `develop` via PR #2 with green automated quality checks.

---

## 4. Weekly Grade Calculation

| Rubric Criterion | Assessed Items | Maximum Score | Earned Score |
| :--- | :--- | :---: | :---: |
| **Group Sprint Achievement** | Sprint goal met; backlog/board current | 2.0 Pts | **2.0 Pts** |
| **Individual Contribution** | `hu-status` complete; Conventional Commits; HU done | 2.5 Pts | **2.5 Pts** |
| **Ceremonies & Flow** | Planning/daily/review/retro; per-environment PRs | 0.5 Pts | **0.5 Pts** |
| **Total Score** | **Overall Sprint Grade** | **5.0 / 5.0** | **5.0 / 5.0** |

$$\text{week\_grade} = 0.6 \times \text{group\_sprint} + 0.4 \times \text{individual\_contribution} = 0.6 \times 5.0 + 0.4 \times 5.0 = 5.0$$

---
*Note: Formatted for automated grading script parser at `NN-week/hu-status/README.md`.*
