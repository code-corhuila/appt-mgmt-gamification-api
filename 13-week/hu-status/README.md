# Weekly Status Report — Semana 13 (Threat Modeling & Security Backlog Closeout)

> **Student:** Brayan Yara (`@BrayanYara1`)  
> **Role:** Full Stack & DevOps Lead  
> **Course:** Sistemas Distribuidos 2026-B · Corte 3  
> **Date:** October 2026  
> **Project:** Salud Activa — Distributed Medical Appointment System  
> **Status:** Final Deliverable Complete (CP0 - CP9)

---

## 1. Executive Summary

In Week 13, I conducted a complete threat modeling analysis for the **Salud Activa** system focused on **Trust Boundary TB1** (Untrusted Mobile Client to API Gateway `backend:3000`). I mapped the attack surface, executed a STRIDE assessment, formulated 3 prioritized security user stories, created CI/CD security quality gates with Jest negative authorization tests, and established a security implementation plan.

---

## 2. Complete Checkpoint Execution Summary

| Checkpoint | Task Description | Artifact / Location | Status |
| :--- | :--- | :--- | :---: |
| **CP0** | Threat Model Claim & Setup | [`13-week/workshop/README.md`](../workshop/README.md) | DONE ✅ |
| **CP1** | Attack Surface Map & DFD | [`13-week/workshop/01-attack-surface.md`](../workshop/01-attack-surface.md) | DONE ✅ |
| **CP2** | STRIDE Threat Model Analysis | [`docs/05-architecture/security/stride-BrayanYara1.md`](../../docs/05-architecture/security/stride-BrayanYara1.md) | DONE ✅ |
| **CP3** | Security Backlog & User Stories | [`13-week/workshop/03-security-backlog.md`](../workshop/03-security-backlog.md) | DONE ✅ |
| **CP4** | Security Pipeline & Negative Test | [`13-week/workshop/04-security-ci/`](../workshop/04-security-ci/) | DONE ✅ |
| **CP5** | Peer Review & Initial Status | [`13-week/hu-status/README.md`](README.md) | DONE ✅ |
| **CP6** | STRIDE Refinement & Review Address | [`docs/05-architecture/security/stride-BrayanYara1.md`](../../docs/05-architecture/security/stride-BrayanYara1.md) | DONE ✅ |
| **CP7** | Security Backlog Refinement | [`13-week/workshop/03-security-backlog.md`](../workshop/03-security-backlog.md) | DONE ✅ |
| **CP8** | Negative Test Output & Validation | [`13-week/workshop/04-security-ci/HOW-TO-RUN.md`](../workshop/04-security-ci/HOW-TO-RUN.md) | DONE ✅ |
| **CP9** | Implementation Plan & Final Closeout | [`13-week/hu-status/README.md`](README.md) | DONE ✅ |

---

## 3. Evidence & Deliverable Links

* **Workshop Root:** [`13-week/workshop/`](../workshop/)
* **STRIDE Analysis Branch/PR:** `security/stride-BrayanYara1` (PR #1)
* **Backlog Security Stories:**
  * P0: `[security] Implement IP and User Rate Limiting on Authentication and Turnos Endpoints`
  * P1: `[security] Implement Role-Based Access Control (RBAC) and Scope Verification Middleware`
  * P1: `[security] Implement Payload Schema Validation and Cryptographic Parameter Binding`
* **Google Docs Reflection Document:** "W13 Reflection - Brayan Yara" (Shared with `jesus.gonzalez@corhuila.edu.co`)
* **Physical Library Reference:** Matt Bishop, *Computer Security: Art and Science*, 2nd Ed., Call Number: `005.8 B622c` (CORHUILA Library).
