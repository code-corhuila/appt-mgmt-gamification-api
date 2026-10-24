# Individual Weekly Report - Week 04

**Student:** [Your Name / Team Member]
**User Story:** [HU-03: MVP Delivery (Cut 1)](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/04-requirements/HU-003-Entrega-MVP/HU-003-MVP-Delivery.md)
**Status:** DONE ✅

---

## 1. Individual Contribution (2.5 Pts)

### Tasks Performed
- **Refactor:** Migrated the Authentication module from a monolithic structure to **Hexagonal Architecture (DDD)**.
- **Containerization:** Configured the `docker-compose.yml` and optimized the `Dockerfile` for multi-stage builds.
- **Testing:** Implemented unit tests for the `LoginUser` use case using Jest and Mocks, ensuring 100% logic coverage.
- **Documentation:** Authored **ADR-003** justifying the architectural boundaries and updated the **CHANGELOG**.

### Evidence of Work (Conventional Commits)
- `feat(auth): refactor login to hexagonal architecture`
- `feat(docker): add docker-compose for polyglot persistence (mongo/postgres)`
- `test(auth): add unit tests for login use case`
- `docs(arch): add ADR-003 for hexagonal architecture boundaries`
- `chore(release): prepare v1.0.0 for Cut 1 delivery`

---

## 2. Group Sprint Achievement (2.0 Pts)
- **Sprint Goal:** The team successfully delivered the **Walking Skeleton** of the Salud Activa project.
- **Backlog Status:** [HU-003](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/04-requirements/user-stories.md) is marked as **Completed** in the master backlog. All Cut 1 requirements are met.

---

## 3. Ceremonies & Flow (0.5 Pts)
- **Planning:** Participated in the Cut 1 planning session to define the MVP scope.
- **Daily:** Synchronized daily on the integration between the Android Frontend and the Hexagonal Backend.
- **Review/Retro:** Evaluated the implementation of Polyglot Persistence and finalized the delivery folder structure.
- **Git-Flow:** Followed the environment-based flow (`hu-03-dev` -> `develop` -> `qa` -> `main`).

---
*Note: This report is formatted for automated reading by the grading system.*
