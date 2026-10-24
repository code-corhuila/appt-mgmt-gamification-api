# Estado del Tablero y Backlog — MVP 2 (Corte 2)

**Sprint Goal:** Entregar MVP 2 con Arquitectura Distribuida de Microservicios, Patrón Outbox Transaccional, Saga Orquestada con Compensación y Resiliencia en Docker Compose.

| Historia de Usuario | Descripción / Incremento | Puntos (SP) | Criterios de Aceptación | Estado en Tablero |
| :--- | :--- | :---: | :--- | :---: |
| **HU-MVP2-01** | Descomposición en Microservicios y API Gateway | 5 SP | Servicios aislados, Gateway preserva contratos REST | **DONE ✅** |
| **HU-MVP2-02** | Transactional Event Outbox & Relé RabbitMQ | 5 SP | Outbox embebido en MongoDB, publicación persistente AMQP | **DONE ✅** |
| **HU-MVP2-03** | Orquestación Saga de Reservas y Compensación | 8 SP | Reserva en Auth, confirmación e inyección de fallos | **DONE ✅** |
| **HU-MVP2-04** | Demostración de Fallos y Degradación en Vivo | 3 SP | Parada de RabbitMQ: Liveness 200, Readiness 503, Replay OK | **DONE ✅** |
| **HU-MVP2-05** | Verificación de Release, Flujo PRs y Tag `v2.0.0` | 3 SP | Promoción `hu-mvp2-dev` $\rightarrow$ `develop` $\rightarrow$ `qa` $\rightarrow$ `main`, Tag `v2.0.0` | **DONE ✅** |

**Total Entregado:** 24 SP (100% completado)
