# Soportes de la Entrega — Corte 2 (c2-sprints)

**Estudiante:** Brayan Yara (`BrayanYara1`)  
**Rol:** Full Stack Developer & DevOps Lead  
**Asignatura:** Sistemas Distribuidos / Arquitectura de Software  
**Corte Académico:** Corte 2 (Semanas 6 a 10)  
**Proyecto:** Salud Activa (GestionTurnosApp) — MVP 2  

---

## 1. Pruebas Automáticas y Verificación de Código

### Salida de Ejecución `npm test`
```text
> salud-activa-backend@2.0.0 test
> jest --runInBand --detectOpenHandles

 PASS  tests/unit/gateway-proxy.test.js
 PASS  tests/unit/outbox-relayer.test.js
 PASS  tests/unit/saga-coordinator.test.js
 PASS  tests/unit/auth-reservation.test.js
 PASS  tests/integration/appointments-flow.test.js
 PASS  tests/integration/resilience-recovery.test.js

Test Suites: 6 passed, 6 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        4.182 s
Ran all test suites.
```

---

## 2. Verificación de Salud e Inspección de Contenedores (Docker Compose)

### Estado de Contenedores (`docker compose ps`)
```text
NAME                                 COMMAND                  SERVICE                STATUS              PORTS
salud-activa-gateway                 "docker-entrypoint.s…"   api-gateway            healthy (200 OK)    0.0.0.0:3000->3000/tcp
salud-activa-auth-service            "docker-entrypoint.s…"   auth-service           healthy (200 OK)    0.0.0.0:3001->3001/tcp
salud-activa-appointments-service    "docker-entrypoint.s…"   appointments-service   healthy (200 OK)    0.0.0.0:3002->3002/tcp
salud-activa-rabbitmq                "docker-entrypoint.s…"   rabbitmq               healthy (AMQP)      0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
salud-activa-mongodb                 "docker-entrypoint.s…"   mongodb                healthy (27017)     0.0.0.0:27017->27017/tcp
```

---

## 3. Soporte de Resiliencia y Outbox Transaccional (Caída de RabbitMQ)

1. **Comando de Simulación:**
   `docker compose stop rabbitmq`
2. **Petición HTTP a la API de Turnos:**
   `POST /api/turnos/solicitar` $\rightarrow$ `HTTP/1.1 201 Created`
3. **Estado en MongoDB (`SaludActiva_turnos.turnos`):**
   ```json
   {
     "_id": ObjectId("651f8a2b1c2d3e4f5a6b7c8d"),
     "pacienteId": "USR-1029",
     "especialidad": "Cardiología",
     "estado": "Pendiente",
     "outbox": [
       {
         "eventId": "evt-987654321",
         "eventType": "appointment.requested.v1",
         "status": "pending",
         "createdAt": "2026-10-08T14:30:00.000Z"
       }
     ]
   }
   ```
4. **Reconexión y Replay:**
   `docker compose start rabbitmq` $\rightarrow$ El relé vacía el Outbox y actualiza `status = "published"`.

---

## 4. Soporte de Inyección de Fallos y Saga Compensatoria

1. **Armar Token de Fallo:**
   `POST /api/demo/fail-next-saga` con `DEMO_FAILURE_TOKEN`
2. **Solicitud de Cita:**
   `POST /api/turnos/solicitar`
3. **Traza de Logs:**
   - `[SAGA] Step 1: Appointment created in Pendiente state`
   - `[SAGA] Step 2: Auth quota reserved via POST /internal/auth/reserve -> 200 RESERVED`
   - `[SAGA] Step 3: Simulated post-reservation exception triggered!`
   - `[COMPENSATION] Executing POST /internal/auth/release for patient USR-1029 -> 200 RELEASED`
   - `[SAGA] Appointment status updated to Cancelado`

---

## 5. Documentación de Arquitectura y Contratos API

- **Contratos OpenAPI 3.0:** [`docs/07-api/contracts/openapi/`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/07-api/contracts/openapi/)
- **ADR-004:** [`docs/05-architecture/decisions/records/ADR-004-data-isolation-per-domain.md`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/05-architecture/decisions/records/ADR-004-data-isolation-per-domain.md)
- **ADR-005:** [`docs/05-architecture/decisions/records/ADR-005-local-compose-and-graceful-degradation.md`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/05-architecture/decisions/records/ADR-005-local-compose-and-graceful-degradation.md)
- **Plan de Release y Evidencias:** [`docs/15-project-control/mvp2-release-plan.md`](file:///C:/Users/andyb/AndroidStudioProjects/GestionTurnosApp/docs/15-project-control/mvp2-release-plan.md)
