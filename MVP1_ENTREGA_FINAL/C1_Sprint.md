# Resumen de Entrega Final: MVP 1 - Corte 1

Este documento consolida toda la información, arquitectura y evidencias generadas para cumplir con los requisitos del **Corte 1 (Calificación 5.0)** del proyecto **GestionTurnosApp**.

---

## 1. Historia de Usuario: HU-003 - Entrega MVP
**Título:** Construir y entregar el MVP funcional del Corte 1.  
**Estado:** COMPLETADA ✅  

### Tareas Clave Realizadas:
*   **Configuración:** Estructura MVVM en Android y Hexagonal en Backend.
*   **Desarrollo:** Implementación de Login, Auth Logic e Integración con API.
*   **QA:** Pruebas unitarias y validación de flujo Git.
*   **Entrega:** Creación de Release v1.0.0, CHANGELOG y ADRs.

---

## 2. Arquitectura del Sistema (Criterio: 1.25 pts)
Se ha implementado una **Arquitectura Hexagonal (DDD)** en el servicio backend para asegurar la independencia de la lógica de negocio.

### Capas Implementadas:
*   **Domain:** Entidades puras e interfaces de repositorios.
*   **Application:** Casos de uso (Login y Registro).
*   **Infrastructure:** Adaptadores para Express.js, Mongoose y JWT.

### Contenerización:
*   **Docker Compose:** Orquestación de `backend-api`, `mongodb` y `postgres`.
*   **Dockerfile:** Multi-etapa basado en node-alpine para alta eficiencia.

---

## 3. Calidad de Código y Pruebas (Criterio: 1.25 pts)
*   **Pruebas Unitarias:** Implementadas con Jest en la capa de aplicación.
*   **Comando de ejecución:** `npm test -- --forceExit`.
*   **Principios:** Aplicación de SOLID, Clean Code y desacoplamiento de infraestructura.

---

## 4. Cumplimiento de Scrum (Criterio: 1.0 pts)
*   **Versionado:** Etiqueta `v1.0.0` definida.
*   **Documentación:**
    *   [ADR-003: Hexagonal Architecture](file:///docs/05-architecture/decisions/adr-003-hexagonal-architecture-backend.md)
    *   [CHANGELOG.md](file:///CHANGELOG.md)
*   **Git-Flow:** Flujo `dev` -> `qa` -> `main` respetado.

---

## 5. Reporte Semanal Individual (Semana 04)
Este reporte es el que lee el sistema del profesor para el **Factor 1.1**:

### Contribución Individual:
*   Refactorización a arquitectura Hexagonal.
*   Configuración completa de Docker Compose.
*   Escritura de tests unitarios y ADRs.
*   Uso de **Conventional Commits** (`feat`, `test`, `docs`, `chore`).

---

## 6. Guía de Sustentación (Demo)
Para la demo en vivo ante el evaluador:
1.  Navegar a la raíz del proyecto.
2.  Ejecutar: `docker compose up --build`.
3.  Mostrar el navegador en: `http://localhost:3000`.
4.  Mostrar las carpetas `04-week/hu-03-status/` para evidencia individual.
5.  Ejecutar `npm test` en la carpeta `backend/`.

---
**Proyecto:** GestionTurnosApp  
**Corte:** 1  
**Entrega:** Consolidada en carpeta `MVP1_ENTREGA_FINAL/`
