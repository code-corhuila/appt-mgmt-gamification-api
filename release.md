# Release v3.0.0 - Control de Commits y Entregables (MVP 3 / Corte 3)

**Fecha de Entrega:** 29 de Octubre  
**Tag de Release:** `v3.0.0`

---

## 📌 Identificación de Commits por Repositorio

| Repositorio | Tag | Commit ID (Hash) | Descripción |
| :--- | :--- | :--- | :--- |
| **ProyectoDistribuidos2026** (Backend, Android & Web) | `v3.0.0` | `da3a25e5a9a0ef0e3cb87a2c5f8cf7159160ab9f` | Release Final MVP 3 - Corte 3: Observabilidad, Seguridad DevSecOps (STRIDE/Trivy), Saga + Outbox, Chaos Engineering y CI/CD. |

---

## 📦 Generación de Entregables (.zip sin `node_modules`)

Para generar el archivo `.zip` del código fuente limpio para la entrega:

```bash
# Comando git archive (excluye automáticamente node_modules y archivos no rastreados)
git archive --format=zip --output=GestionTurnosApp-v3.0.0.zip v3.0.0
```

> **Nota:** Alternativamente, el archivo `.zip` se puede descargar directamente desde GitHub en la sección **Releases -> Source code (zip)** del tag `v2.0.0`.

---

## ⚙️ Configuración de CI/CD (GitHub Actions)
- **Workflow:** `.github/workflows/mvp2-quality.yml`
- **Triggers:** Exclusivamente Pull Requests (`PR`) hacia ramas `develop` y `qa`.
- **Estrategia de Concurrencia:** `concurrency` con `cancel-in-progress: true`.
- **Timeout Máximo:** `timeout-minutes: 10`.

---

## 🚀 Orquestación de Servicios con Docker Compose

```bash
# Iniciar la pila completa de servicios
docker compose up -d --build

# Verificar estado y healthchecks
docker compose ps
```

**Servicios Orquestados:**
1. `backend` (API Gateway / Backend principal) -> `http://localhost:3000`
2. `auth-service` (Servicio de Autenticación) -> `http://localhost:3001`
3. `appointments-service` (Servicio de Citas/Turnos) -> `http://localhost:3002`
4. `rabbitmq` (Bús de Mensajes / Cola asíncrona) -> `amqp://localhost:5672`
5. `mongodb` (Base de Datos MongoDB 7.0) -> `mongodb://localhost:27017`
