# Individual Weekly Report — Week 08 (Corte 2)

**Student:** Brayan Yara (`BrayanYara1`)  
**Role:** Full Stack Developer & DevOps Lead  
**User Stories:** [HU-MVP2-04: Live Failure Demonstration & Graceful Degradation](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md) & [HU-MVP2-05: Corte 2 Release Verification & Branch Flow](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)  
**Status:** DONE ✅  
**Story Points:** 6 SP (Total Sprint: 24 SP)  

---

## 1. Individual Contribution (2.5 Pts)

### Tasks Performed
- **Live Failure & Degradation Demo (HU-MVP2-04):** Executed and verified live failure scenarios in local Docker Compose environment:
  1. **Broker Outage:** Stopped RabbitMQ container (`docker compose stop rabbitmq`). Observed API Gateway and Appointments service remain healthy (Liveness `200`), Appointments Readiness reports `503 Service Unavailable`, new appointment creation request is accepted and stored in MongoDB with `outbox[0].status = "pending"`. Restarted RabbitMQ (`docker compose start rabbitmq`), verified message publisher relay drained pending outbox entries and reached `Confirmado`.
  2. **Compensating Saga:** Armed fault injection token (`POST /api/demo/fail-next-saga`), submitted booking request. Verified post-reservation exception triggered compensating release on Auth service (`RELEASED`), and appointment status rolled back to `Cancelado`.
- **Environment Promotion & Release Evidence (HU-MVP2-05):** Executed multi-environment Git-Flow promotion process across repository branches:
  - `hu-mvp2-dev` → `develop` (PR #2 merged after green CI)
  - `develop` → `qa` (PR #3 merged after green CI)
  - `qa` → `main` (PR #4 merged after green CI)
- **Release Documentation & Tagging:** Published annotated release tag `v2.0.0` on green `main` commit `f3dd2eb`, created GitHub Release `v2.0.0`, updated `CHANGELOG.md`, `15-project-control/mvp2-release-plan.md`, and architectural ADRs.

### Evidence of Work (Conventional Commits)
- `feat(demo): verify live broker outage degradation and recovery in docker compose`
- `test(ci): configure GitHub Actions quality workflow for compose config and test execution`
- `docs(release): publish release plan evidence and audit baseline for Corte 2`
- `docs(changelog): update CHANGELOG.md for v2.0.0 release delivery`
- `chore(release): tag release v2.0.0 on main commit f3dd2eb`

---

## 2. Group Sprint Achievement (2.0 Pts)

- **Sprint Goal:** Met. Complete Corte 2 (MVP 2) increment delivered with 24 SP. All 5 user stories (HU-MVP2-01 through 05) completed, tested, and verified.
- **Backlog & Board Status:** Fully current. All sprint items marked as **Done** in the master backlog and release plan.

---

## 3. Ceremonies & Flow (0.5 Pts)

- **Planning:** Confirmed exit criteria, release plan checklist, and CI build verification requirements.
- **Daily Stand-up:** Logged daily progress on PR branch promotions and tag verification workflows.
- **Review & Retro:** Conducted live review demo showcasing broker interruption recovery and compensating saga. Held Sprint Retrospective (recorded in project control docs).
- **Git Flow & Per-Environment PRs:** Followed environment promotion flow (`hu-mvp2-dev` → `develop` → `qa` → `main`). All PRs merged with passing GitHub Actions CI workflows. Release tagged as `v2.0.0`.

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
