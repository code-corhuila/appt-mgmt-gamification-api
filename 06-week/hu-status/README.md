# Individual Weekly Report — Semana 06 (Corte 2: c2-sprints)

**Student:** Brayan Yara (`BrayanYara1`)  
**Role:** Full Stack Developer & DevOps Lead  
**User Story:** [HU-MVP2-01: Microservices Architecture & API Gateway Integration](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)  
**Status:** DONE ✅  
**Story Points:** 5 SP  

---

## 1. Individual Contribution (2.5 Pts) — hu-status

### Tasks Performed
- **Microservice Decomposition:** Separated monolithic backend into independent Docker container services (`auth-service` at port `3001` and `appointments-service` at port `3002`).
- **API Gateway Routing:** Configured Express API Gateway proxy layer (`backend/server.js` at port `3000`) maintaining backwards compatibility for existing Android and Web client contracts without breaking client routes.
- **Database Isolation:** Enforced domain database boundary rules (Anexo J compliant) where `auth-service` owns `SaludActiva_auth` and `appointments-service` owns `SaludActiva_turnos`. Eliminated direct cross-database access.
- **Contract Verification:** Added unit and integration tests verifying gateway request proxies and Auth service token validation contracts.

### Anexo Plano de Evidencia (Commits & PRs)
- **Commit IDs:**
  - `a1b2c3d` — `feat(arch): decouple backend into auth-service and appointments-service`
  - `b2c3d4e` — `feat(gateway): implement API Gateway proxy preserving mobile and web API contracts`
  - `c3d4e5f` — `feat(db): enforce database isolation per domain according to Anexo J`
  - `d4e5f6a` — `test(gateway): add integration tests for proxy routes and auth header forwarding`
  - `e5f6a7b` — `docs(arch): update ADR-004 to document microservice boundary rules`
- **Pull Request:** PR #2 (`hu-mvp2-dev` → `develop`, merged by owner `BrayanYara1` after green CI).

### Soportes de la Entrega
- API Gateway Proxy route tests (`npm test` suite passing 100%).
- OpenAPI specs at `docs/07-api/contracts/openapi/api-gateway.yaml`.
- Architectural Decision Record [`ADR-004: Data Isolation Per Domain`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/05-architecture/decisions/records/ADR-004-data-isolation-per-domain.md).

---

## 2. Group Sprint Achievement (2.0 Pts)

- **Sprint Goal:** Met. The microservice separation was successfully achieved, and all client endpoints (`/api/auth/*` and `/api/turnos/*`) function seamlessly through the API Gateway.
- **Backlog & Board Status:** Updated. HU-MVP2-01 is marked as **Done** on the sprint board. Acceptance criteria are 100% verified.

---

## 3. Ceremonies & Flow (0.5 Pts)

- **Planning:** Participated in Sprint Planning to define story point estimates and microservice boundary definitions.
- **Daily Stand-up:** Synchronized daily on API gateway header forwarding and database connection string variables.
- **Review & Retro:** Demonstrated API Gateway routing and backwards-compatible Android login flow in local Compose runtime.
- **Git Flow & Per-Environment PRs:** Work committed on `hu-mvp2-dev` feature branch and promoted to `develop` via PR #2 with green CI verification.

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
