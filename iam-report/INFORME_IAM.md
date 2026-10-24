# Informe de Prácticas IAM - Proyecto Salud Activa

**Estudiante:** Brahiam (Yara)
**Fecha:** 20 de Septiembre de 2026
**Cuenta AWS ID:** 077024045706

---

## Bloque A · Personas y grupos

### Práctica 01 · El administrador de identidades
- **Objetivo:** Separación de funciones creando un administrador de IAM (`Yara-IAM`) para no usar la cuenta raíz.
- **Evidencia:** Se verificó el error "You don't have permissions to create a bucket" al intentar usar S3 con este usuario, confirmando que solo tiene permisos de IAM.
- **🤔 Para pensar:** Es más seguro porque si roban las claves de `dev`, no pueden borrar la cuenta ni cambiar permisos; y si roban las de `iam`, no pueden acceder a los datos médicos en S3.

### Práctica 02 & 03 · Usuario de Pruebas y ReadOnlyAccess
- **Objetivo:** Crear el grupo `Testing` (pruebas) con permisos de lectura y el usuario `Yara-qa`.
- **Evidencia:** El usuario `Yara-qa` intentó crear un bucket y recibió un error de **denegación implícita** ("no identity-based policy allows...").
- **Aprendizaje:** El permiso se hereda del grupo. Sin `ReadOnlyAccess`, el usuario no puede ni listar los buckets.

---

## Bloque B · Políticas propias

### Práctica 06 · Subir solo a la carpeta `fotos/`
- **Objetivo:** Restringir al usuario de QA para que solo pueda subir archivos a una ruta específica.
- **Evidencia:** 
    1. **Éxito:** Carga correcta en `s3://app-dia7-yara-2026.../fotos/`.
    2. **Fallo:** Error "Acceso denegado" al intentar cargar en la raíz del bucket.
- **Política utilizada:** `subir-fotos-solo-fotos`.

### Práctica 07 · El Deny explícito gana
- **Objetivo:** Demostrar que un `Deny` explícito sobrepasa cualquier `Allow`.
- **Evidencia:** Al aplicar la política `prohibido-borrar` al usuario `dev`, este no podrá eliminar objetos aunque tenga `PowerUserAccess`.

---

## Conclusiones Técnicas
1. **Denegación Implícita vs Explícita:** Se identificó que la implícita ocurre por falta de permisos, mientras que la explícita es un bloqueo directo.
2. **Resource con Prefijo:** El uso de `/*` en el ARN del recurso es vital para definir alcances sobre "carpetas" en S3.
