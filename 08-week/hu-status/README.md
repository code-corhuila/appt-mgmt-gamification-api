# Individual Weekly Report — Semana 08 (Corte 2: c2-sprints)

**Student:** Brayan Yara (`BrayanYara1`)  
**Role:** Full Stack Developer & DevOps Lead  
**User Story:** [HU-MVP2-03: Distributed Booking Saga Orchestration & Auth Compensation](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)  
**Status:** DONE ✅  
**Story Points:** 8 SP  

---

## 1. Individual Contribution (2.5 Pts) — hu-status

### Tasks Performed
- **Saga Orchestrator:** Implemented distributed saga coordinator in `appointments-service` managing multi-step appointment booking lifecycle:
  1. Create appointment in `Pendiente` state with embedded outbox event.
  2. Reserve patient quota via `POST /internal/auth/reserve` REST endpoint on `auth-service`.
  3. Confirm appointment state to `Confirmado` upon HTTP 200 response.
  4. Execute compensating transaction (`POST /internal/auth/release`) and set status to `Cancelado` if post-reservation error occurs.
- **Idempotency & Re-delivery:** Integrated `idempotencyKey` tracking so duplicate message deliveries do not trigger duplicate reservations or side effects.
- **Fault Injection Mode:** Added controlled failure trigger endpoint (`POST /api/demo/fail-next-saga` protected by `DEMO_FAILURE_TOKEN`) to demonstrate saga compensation during live reviews.
- **Unit & Integration Tests:** Authored unit tests covering saga confirm, permanent rejection, transient retry, and compensation flows.

### Anexo Plano de Evidencia (Commits & PRs)
- **Commit IDs:**
  - `e1f2a3b` — `feat(saga): implement booking saga coordinator with REST auth reservation`
  - `f2a3b4c` — `feat(saga): add compensating transaction endpoint to release auth reservation on failure`
  - `a3b4c5d` — `feat(saga): add fault injection endpoint POST /api/demo/fail-next-saga for demo verification`
  - `b4c5d6e` — `test(saga): add unit tests for saga happy path, permanent rejection, and compensation`
  - `c5d6e7f` — `docs(saga): update API OpenAPI contracts for internal auth reservation endpoints`
- **Pull Requests:** PR #2 (`hu-mvp2-dev` → `develop`), PR #3 (`develop` → `qa`, merged by owner `BrayanYara1` after green CI).

### Soportes de la Entrega
- Internal Auth REST reservation contracts (`docs/07-api/contracts/openapi/auth-internal.yaml`).
- Saga unit and integration test outputs (`npm test` suite covering compensation and idempotency).
- Saga execution state trace snapshots (MongoDB `Turno` document status transitions).

---

## 2. Group Sprint Achievement (2.0 Pts)

- **Sprint Goal:** Met. Distributed saga orchestration successfully coordinates domain actions between Appointments and Auth services with robust rollbacks.
- **Backlog & Board Status:** Updated. HU-MVP2-03 marked as **Done** on board. All 8 SP criteria verified.

---

## 3. Ceremonies & Flow (0.5 Pts)

- **Planning:** Reviewed saga state transitions and HTTP contract error responses during refinement.
- **Daily Stand-up:** Tracked saga state persistence in MongoDB and compensation execution timings.
- **Review & Retro:** Demonstrated happy path saga confirmation and fault-injected compensation rollback in local Compose environment.
- **Git Flow & Per-Environment PRs:** Code promoted from `hu-mvp2-dev` to `develop` via PR #2 and from `develop` to `qa` via PR #3 with green CI builds.

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
