# Weekly Status Report — Semana 13 (Threat Modeling & Security Backlog)

> **Student:** Brayan Yara (`@BrayanYara1`)  
> **Role:** Full Stack & DevOps Lead  
> **Course:** Sistemas Distribuidos 2026-B · Corte 3  
> **Date:** October 2026  
> **Project:** Salud Activa — Distributed Medical Appointment System

---

## 1. Executive Summary

During Week 13, I completed the threat modeling analysis for the **Salud Activa** system focused on **Trust Boundary TB1** (Untrusted Mobile Client to API Gateway `backend:3000`). I mapped the attack surface, conducted a STRIDE evaluation, formulated 3 prioritized security user stories in the backlog, created a GitHub Actions security workflow, and implemented automated negative authorization tests.

---

## 2. Checkpoint Execution Checklist

| Checkpoint | Task Description | Artifact / Location | Status |
| :--- | :--- | :--- | :---: |
| **CP0** | Threat Model Claim & Setup | [`13-week/workshop/README.md`](../workshop/README.md) | DONE ✅ |
| **CP1** | Attack Surface Map & DFD | [`13-week/workshop/01-attack-surface.md`](../workshop/01-attack-surface.md) | DONE ✅ |
| **CP2** | STRIDE Threat Model Analysis | [`docs/05-architecture/security/stride-BrayanYara1.md`](../../docs/05-architecture/security/stride-BrayanYara1.md) | DONE ✅ |
| **CP3** | Security Backlog & User Stories | [`13-week/workshop/03-security-backlog.md`](../workshop/03-security-backlog.md) | DONE ✅ |
| **CP4** | Security Pipeline & Negative Test | [`13-week/workshop/04-security-ci/`](../workshop/04-security-ci/) | DONE ✅ |
| **CP5** | Peer Review & Weekly Wrap-up | [`13-week/hu-status/README.md`](README.md) | DONE ✅ |

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
