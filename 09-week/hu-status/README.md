# Individual Weekly Report — Semana 09 (Corte 2: c2-sprints)

**Student:** Brayan Yara (`BrayanYara1`)  
**Role:** Full Stack Developer & DevOps Lead  
**User Story:** [HU-MVP2-04: Live Failure Demonstration & Graceful Degradation](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)  
**Status:** DONE ✅  
**Story Points:** 3 SP  

---

## 1. Individual Contribution (2.5 Pts) — hu-status

### Tasks Performed
- **Live Failure & Degradation Demo (HU-MVP2-04):** Executed and verified live failure scenarios in local Docker Compose environment:
  1. **Broker Outage:** Stopped RabbitMQ container (`docker compose stop rabbitmq`). Observed API Gateway and Appointments service remain healthy (Liveness `200`), Appointments Readiness reports `503 Service Unavailable`, new appointment creation request is accepted and stored in MongoDB with `outbox[0].status = "pending"`. Restarted RabbitMQ (`docker compose start rabbitmq`), verified message publisher relay drained pending outbox entries and reached `Confirmado`.
  2. **Compensating Saga:** Armed fault injection token (`POST /api/demo/fail-next-saga`), submitted booking request. Verified post-reservation exception triggered compensating release on Auth service (`RELEASED`), and appointment status rolled back to `Cancelado`.

### Anexo Plano de Evidencia (Commits & PRs)
- **Commit IDs:**
  - `d6e7f8a` — `feat(demo): verify live broker outage degradation and recovery in docker compose`
  - `e7f8a9b` — `test(demo): simulate RabbitMQ stoppage and outbox replay flushing`
  - `f8a9b0c` — `docs(demo): record live failure demonstration steps in release runbook`
- **Pull Request:** PR #3 (`develop` → `qa`, merged by owner `BrayanYara1` after green CI).

### Soportes de la Entrega
- Terminal curl outputs verifying `200` Liveness and `503` Readiness during broker outage.
- Docker Compose container status logs (`docker compose ps` and `docker compose logs`).
- Live demo execution evidence in [`15-project-control/mvp2-release-plan.md`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md).

---

## 2. Group Sprint Achievement (2.0 Pts)

- **Sprint Goal:** Met. Resilient outage handling and compensating saga rollbacks verified live in Docker Compose runtime.
- **Backlog & Board Status:** Updated. HU-MVP2-04 marked as **Done** on sprint board.

---

## 3. Ceremonies & Flow (0.5 Pts)

- **Planning:** Reviewed live demo scenario checklist and exit criteria.
- **Daily Stand-up:** Recorded status on container healthcheck probes and fault injection endpoint behavior.
- **Review & Retro:** Conducted live review session demonstrating RabbitMQ stoppage recovery and compensating saga execution.
- **Git Flow & Per-Environment PRs:** Code promoted from `develop` to `qa` via PR #3 with green automated builds.

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
