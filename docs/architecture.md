
# CodeSphere — System Architecture

## Overview

CodeSphere is a production-grade collaborative DSA practice platform designed with a contract-first, layered architecture.
The system prioritizes **clear domain boundaries**, **database agnosticism**, and **future scalability** without premature abstraction.

The architecture follows a principle-driven approach rather than framework-driven shortcuts.

---

## High-Level Architecture

The system is divided into clear layers:

→ UI / App Logic
→ Domain Contracts
→ Repositories
→ Infrastructure (Database, Auth, External APIs)

Each layer depends only on the layer below it.

---

## Core Components

### 1. Web Application (apps/web)

- Built with Next.js App Router
- Uses Edge-compatible patterns where applicable
- Contains no database-specific logic
- Consumes domain contracts and repository outputs only

Responsibilities:

- Rendering UI
- Calling API routes
- Enforcing route-level access control

---

### 2. Domain Contracts (packages/shared-types)

- Defines stable, storage-agnostic system semantics
- Uses Zod schemas as the single source of truth
- Shared across UI, APIs, repositories, and future services

Key principle:

> Domain meaning is defined once and implemented many times.

This layer contains **no runtime logic**.

---

### 3. Persistence Layer (Repositories)

- Repositories expose intent-based data access
- No MongoDB ObjectIds or DB-specific fields leak upward
- Acts as the translation boundary between domain contracts and database documents

Example:

- UI asks for `User`
- Repository fetches MongoDB document
- Repository returns domain-safe `User` object

---

### 4. Database Infrastructure (apps/web/lib/db)

- MongoDB Node.js driver (not Mongoose)
- Promise-based, singleton-safe connection handling
- Treated as infrastructure, not business logic

Rationale:

- Edge runtime compatibility
- Avoids ORM-induced coupling
- Domain contracts already exist (no schema duplication)

---

### 5. Authentication

- Implemented using Auth.js
- Auth provider data is separated from core user identity
- Supports multiple auth providers per user

Identity modeling follows real-world systems (GitHub, Slack).

---

### 6. External Services (Planned)

- Online compiler API (e.g., Judge0)
- AI-generated problem statements
- Notification services

These are accessed through isolated service modules.

---

## Future Architecture Notes

- Realtime collaboration will be implemented as a separate Node.js service
- Database infrastructure can be extracted into a shared package once multiple consumers exist
- Architecture intentionally avoids premature generalization

---

## Architectural Philosophy

- Contracts before implementations
- Infrastructure is replaceable
- Business logic is testable
- Scaling should not require refactoring core domains
  ---
