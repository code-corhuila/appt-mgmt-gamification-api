# Matriz de Roles y Permisos (S16) - Salud Activa

| Perfil | Implementación en AWS | Políticas Asociadas | Justificación del Negocio | Restricción Crítica (NO debe poder) |
|---|---|---|---|---|
| **Administración** | Usuario `Yara-IAM` (Grupo: `Administration`) | `IAMFullAccess`, `AWSBillingReadOnlyAccess` | Gestionar el ciclo de vida de los empleados. | Tocar recursos de producción como S3. |
| **Desarrollo** | Usuario `Yara-dev` (Grupo: `curso-arquitectura`) | `PowerUserAccess`, `ReadOnlyAccess`, `prohibido-borrar` | Desplegar microservicios y configurar ECS. | Borrar el bucket principal de documentos médicos. |
| **Pruebas (QA)** | Usuario `Yara-qa` (Grupo: `Testing`) | `ReadOnlyAccess`, `subir-fotos-solo-fotos`, `mi-carpeta-personal` | Validar flujos de carga de resultados médicos. | Ver o modificar datos fuera de su carpeta asignada. |
| **Auditoría** | Rol `rol-auditor` | `SecurityAudit`, `s3:GetObject` (fotos/) | Revisar logs y configuraciones de seguridad. | Modificar cualquier recurso o ver datos PII. |
