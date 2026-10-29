# W13 Workshop — Threat Modeling and Security Backlog

> **Course:** Distributed Systems 2026-B · Group 2 · Term 3  
> **Student:** Brayan Yara (`@BrayanYara1`)  
> **Project:** Salud Activa — Distributed Medical Appointment Platform

---

## Configuration Block (CONFIG)

```yaml
STUDENT_NAME: "Brayan Yara"
GITHUB_USER: "BrayanYara1"
COURSE: "Sistemas Distribuidos 2026-B"
GROUP: "Grupo 2"
CLAIMED_BOUNDARY: "TB1: External Client (Android App) -> API Gateway (backend:3000)"
REPOSITORY_DOCS_PR: "https://github.com/BrayanYara1/ProyectoDistribuidos2026/pull/1"
REPOSITORY_DOCS_ISSUE: "https://github.com/BrayanYara1/ProyectoDistribuidos2026/issues/1"
LIBRARY_BOOK: "Computer Security: Art and Science, Matt Bishop, 2nd Edition, Addison-Wesley, 2019, Call Number: 005.8 B622c"
LIBRARY_RECORD_TIME: "2026-10-29 08:20 AM"
REFLECTION_DOC: "https://docs.google.com/document/d/YOUR_GOOGLE_DOC_ID/edit"
STORIES:
  - "https://github.com/BrayanYara1/ProyectoDistribuidos2026/issues/2"
  - "https://github.com/BrayanYara1/ProyectoDistribuidos2026/issues/3"
  - "https://github.com/BrayanYara1/ProyectoDistribuidos2026/issues/4"
```

---

## Workshop Overview & Objectives

This workshop implements a threat modeling and security engineering workflow for the **Salud Activa** distributed ecosystem. The primary focus is the security perimeter between untrusted clients (Android mobile app) and the backend API Gateway (`backend:3000`), analyzing attack vectors using the STRIDE methodology, establishing CI/CD security quality gates, and translating identified vulnerabilities into actionable security user stories.

### Artifacts Index
* **CP1 — Attack Surface Map:** [`01-attack-surface.md`](01-attack-surface.md)
* **CP2 — STRIDE Analysis:** [`../../docs/05-architecture/security/stride-BrayanYara1.md`](../../docs/05-architecture/security/stride-BrayanYara1.md)
* **CP4 — Security Pipeline & Tests:** [`04-security-ci/`](04-security-ci/)
* **CP5 — Weekly Status:** [`../hu-status/README.md`](../hu-status/README.md)
