# HOW-TO-RUN — Negative Authorization Security Test Execution Guide

> **Author:** Brayan Yara (`@BrayanYara1`)  
> **Target Endpoint:** `POST /api/turnos` (API Gateway / `backend:3000`)  
> **Covered User Story:** Security Backlog Story 2 (`[security] Implement Role-Based Access Control (RBAC) and Scope Verification Middleware`) — Acceptance Criterion AC2.

---

## 1. Overview & Purpose

This guide demonstrates how to execute the negative authorization security test locally and verify that the API Gateway correctly enforces security boundaries on `TB1`, rejecting unauthenticated requests, tampered tokens, and privilege escalation attempts.

---

## 2. Local Execution Steps

### Step 1: Navigate to Project Directory
Ensure Node.js v20+ and npm are installed on your workstation:
```bash
cd backend
```

### Step 2: Install Test Dependencies (if not present)
```bash
npm install --save-dev jest supertest jsonwebtoken
```

### Step 3: Run the Negative Security Test Suite
Execute Jest against the security test suite:
```bash
npx jest ../13-week/workshop/04-security-ci/auth-negative.test.js
```

---

## 3. Verified Console Output Record

```text
 PASS  13-week/workshop/04-security-ci/auth-negative.test.js
  Negative Security Authorization Tests — TB1 Gateway Perimeter
    ✓ 1. Unauthenticated request to /api/turnos MUST fail with 401 Unauthorized (18 ms)
    ✓ 2. Request with tampered/forged JWT signature MUST fail with 403 Forbidden (4 ms)
    ✓ 3. Patient user attempting to invoke Admin purge endpoint MUST fail with 403 Forbidden (3 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        0.412 s
Ran all test suites matching /auth-negative.test.js/.
```

---

## 4. GitHub Actions Workflow Validation

The `security.yml` workflow was validated locally using `actionlint` syntax verification:
* **Workflow File:** `13-week/workshop/04-security-ci/security.yml`
* **Status:** Valid YAML 1.2 schema with 3 automated security gates (Gitleaks, npm audit, Jest authorization test).
