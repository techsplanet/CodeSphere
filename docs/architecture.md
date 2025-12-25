# CodeSphere — System Architecture

## Overview

CodeSphere is a production-grade collaborative DSA practice platform designed with a **contract-first, layered architecture**.

The system prioritizes:

- Clear domain boundaries
- Database and infrastructure agnosticism
- Scalability without premature abstraction
- Long-term maintainability over short-term convenience

The architecture is **principle-driven**, not framework-driven.
Frameworks are treated as tools, not architectural foundations.

---

## High-Level Architecture

CodeSphere follows a strict layered model:

UI / App Logic
	↓
Domain Contracts
	↓
Repositories
	↓
Infrastructure (Database, Auth, External APIs)

Each layer depends **only on the layer below it** and never bypasses boundaries.

This prevents:

- Domain logic leakage
- Database coupling
- Rewrite-heavy scaling
- Fragile feature growth

---

## Core Components

### 1. Web Application (`apps/web`)

The primary application is built using **Next.js App Router**.

Key characteristics:

- Uses Edge-compatible patterns where applicable
- Contains **no database-specific logic**
- Consumes only domain-safe objects returned by repositories
- Treats APIs and repositories as black boxes

Responsibilities:

- Rendering UI
- Calling API routes
- Enforcing route-level access control
- Handling user interaction and state

The web app does **not**:

- Construct database queries
- Manipulate persistence fields
- Define domain meaning

---

### 2. Domain Contracts (`packages/shared-types`)

This layer defines the **semantic meaning** of the system.

Key properties:

- Storage-agnostic
- Runtime-agnostic
- Framework-agnostic

Implemented using:

- Zod schemas as the single source of truth
- Type inference for compile-time safety

Key principle:

> Domain meaning is defined once and implemented many times.

This layer contains:

- Entity definitions (User, Team, Sheet, Session, etc.)
- Enums and state machines
- Input/output contracts

This layer explicitly contains **no runtime logic**.

---

### 3. Persistence Layer (Repositories)

Repositories act as the **only gateway** between domain logic and the database.

Responsibilities:

- Translate database documents into domain-safe objects
- Enforce domain contracts before data leaves persistence
- Hide database-specific fields (`_id`, `ObjectId`, soft-delete flags)

Example flow:

- UI requests a `User`
- Repository queries MongoDB
- Repository maps the document to a domain `User`
- Repository returns a validated, domain-safe object

Repositories expose **intent**, not queries.

This ensures:

- Database portability
- Testable business logic
- No persistence leakage into upper layers

---

### 4. Database Infrastructure (`apps/web/lib/db`)

Database connectivity is treated as **pure infrastructure**.

Implementation details:

- MongoDB Node.js driver (not Mongoose)
- Promise-based, singleton-safe connection handling
- Dev hot-reload and serverless safe

Rationale:

- Edge runtime compatibility
- Avoids ORM-induced coupling
- Domain schemas already exist (no duplication)
- Clear separation between storage and meaning

The database layer:

- Knows how to connect
- Knows nothing about users, teams, or sessions

---

### 5. Authentication & Authorization

CodeSphere uses **Better Auth** as its authentication framework.

Authentication is treated as **infrastructure**, not business logic.

The system separates:

- **Authentication** → Who the user is
- **Authorization** → What the user is allowed to do

#### Why Better Auth

Better Auth was chosen after evaluating Auth.js and other solutions.

Key reasons:

- Simpler mental model for sessions and cookies
- Explicit, readable authentication flows
- Faster iteration without hiding core concepts
- Easier reasoning about security boundaries
- Strong fit for learning-oriented, production-grade systems

This choice allows the project to:

- Focus on **authentication fundamentals**, not framework ceremony
- Remain **interview-explainable**
- Avoid unnecessary abstraction early in development

#### Identity Modeling

Authentication data is intentionally separated from core user identity:

- `users` → domain identity
- `auth_identities` → provider-specific authentication records

This mirrors real-world systems (e.g., GitHub, Slack) and enables:

- Multiple auth providers per user
- Clean auth provider replacement
- Minimal coupling between auth and domain logic

#### Authorization Strategy

Authorization is handled at multiple levels:

- Route-level protection
- Repository-level guarantees
- Role-based access via domain contracts

Authentication libraries do not define authorization rules — the domain does.

---

### 6. External Services (Planned)

External integrations are isolated behind service boundaries.

Planned services include:

- Online compiler APIs (e.g., Judge0)
- AI-assisted content generation
- Notification and scheduling services

Each service:

- Is accessed through a dedicated module
- Can be replaced without affecting domain logic

---

## Future Architecture Notes

- Realtime collaboration will be implemented as a separate Node.js service
- Database infrastructure may be extracted into a shared package once multiple consumers exist
- The system intentionally avoids premature generalization

Every abstraction must earn its existence through real usage.

---

## Architectural Philosophy

- Contracts before implementations
- Infrastructure is replaceable
- Business logic must be testable
- Scaling should not require refactoring core domains

CodeSphere is designed to grow **without architectural regret**.
