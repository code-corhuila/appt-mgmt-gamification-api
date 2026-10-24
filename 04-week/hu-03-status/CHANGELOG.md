# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-04

### Added
- **Backend Refactor:** Implemented Hexagonal Architecture (Ports and Adapters) for the Authentication service.
- **Containerization:** Added `Dockerfile` and `docker-compose.yml` for the complete system (API + MongoDB + PostgreSQL).
- **Documentation:** Added ADR-003 justifying the use of Hexagonal Architecture.
- **CI/CD Preparation:** Established Gitflow branch structure (`develop`, `qa`, `main`).

### Changed
- **Architecture:** Transitioned backend from a traditional MVC-like structure to a DDD-oriented Hexagonal structure.
- **Persistence:** Configured polyglot persistence (MongoDB for profiles and PostgreSQL for appointments) in the container environment.

### Fixed
- Improved error handling in authentication routes.
- Added rate limiting to authentication endpoints to prevent brute-force attacks.

---
*MVP 1 - Corte 1 Delivery*
