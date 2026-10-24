# Salud Activa - Gestión de Bienestar Médico

## Descripción
**Salud Activa** es una plataforma profesional para la gestión de turnos y bienestar médico. El proyecto incluye una aplicación móvil Android nativa moderna y un backend escalable de alto rendimiento desplegado en la nube de AWS.

## Arquitectura del Proyecto
El proyecto sigue principios de **Clean Architecture** y **Clean Code**:

1.  **App Android (`/app`):** 
    - **MVVM:** Separación clara entre la lógica de negocio (ViewModels) y la interfaz (Fragments).
    - **Repository Pattern:** Centralización del acceso a datos (API y Caché Offline).
    - **Data Binding / View Binding:** Interfaz reactiva y limpia.
    - Retrofit + OkHttp para la comunicación con el backend (v2.11.0).
    - Kotlin Coroutines para operaciones asíncronas fluidas.
    - Material Design 3 para una experiencia de usuario profesional y accesible.

2.  **Backend (`/backend`):**
    - **Hexagonal Architecture (DDD):** Domain-driven design with clear separation between Domain, Application, and Infrastructure layers.
    - **Node.js + Express.**
    - **Polyglot Persistence:** MongoDB for User Profiles and PostgreSQL for Appointments.
    - **Security:** JWT authentication and Bcrypt hashing.
    - **Resilience:** Built-in rate limiting and security headers (Helmet).

3.  **Infraestructura (`/terraform_aws`):**
    - Infraestructura como Código (IaC) usando Terraform.
    - Despliegue en AWS ECS Fargate (Serverless Containers).
    - Load Balancer (ALB) para distribución de tráfico y alta disponibilidad global.

## Containerization
The entire system is containerized to ensure "it works on my machine" and in production.
- **Docker Compose:** Orchestrates the API, MongoDB, and PostgreSQL services.
- **Dockerfile:** Multi-stage builds based on Node-Alpine for efficiency.

## Local Execution (Quick Start)

### Using Docker (Recommended)
From the root directory, run:
```bash
docker compose up --build
```
This will start:
- **Backend API:** http://localhost:3000
- **MongoDB:** http://localhost:27017
- **PostgreSQL:** http://localhost:5432

### Manual Execution (Backend)
1. Navigate to `backend/`.
2. Install dependencies: `npm install`.
3. Set up your `.env` file (see `.env.example`).
4. Run tests: `npm test`.
5. Start the server: `npm start`.

### Android
1. Abre el proyecto en Android Studio.
2. Sincroniza Gradle.
3. El `BASE_URL` apunta por defecto a la nube pública de Salud Activa.
4. Ejecuta la app en un emulador o dispositivo físico.

## Infraestructura en AWS
Para desplegar la infraestructura:
1. Ve a `terraform_aws/`.
2. Ejecuta `terraform init`.
3. Ejecuta `terraform apply`.
