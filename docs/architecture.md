
# CodeSphere — System Architecture

## Overview

CodeSphere is a production-grade collaborative DSA practice platform designed with a **contract-first, layered architecture**.

The system prioritizes:

- Clear domain boundaries
- Database and infrastructure agnosticism
- Deterministic security enforcement
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
Domain Logic (Authorization, Policies)
↓
Repositories
↓
Infrastructure (Database, Auth, External APIs)

Each layer depends **only on the layer below it** and never bypasses boundaries.

This prevents:

- Domain logic leakage
- Database coupling
- Security drift
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
- Implement authorization logic

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
- Authorization contracts (permissions, scope, roles)
- Input/output contracts

This layer explicitly contains **no runtime logic**.

---

### 3. Domain Logic Layer (`packages/domain`)

This layer contains pure, deterministic business logic.

It includes:

- Authorization evaluator (`evaluateAuthorization`)
- Permission maps (role → permission policy)
- Enforcement helper (`requirePermission`)

Characteristics:

- Side-effect free
- Storage-agnostic
- Fully unit-tested
- Deterministic (no hidden state)

#### Authorization Engine

Authorization is implemented as:

- A pure evaluation function
- Explicit input (`AuthorizationRequest`)
- Explicit output (`AuthorizationDecision`)
- Clear deny reasons
- No exceptions during evaluation

Authorization never performs:

- Database access
- Logging
- Side effects

#### Enforcement Helper

A centralized helper:

Responsibilities:

- Calls `evaluateAuthorization`
- Throws a domain-level error if denied
- Standardizes enforcement across services
- Prevents copy-paste authorization logic

This ensures there is **one canonical enforcement entry point**.

---

### 4. Persistence Layer (Repositories)

Repositories act as the **only gateway** between domain logic and the database.

Responsibilities:

- Translate database documents into domain-safe objects
- Enforce domain contracts before data leaves persistence
- Hide database-specific fields (`_id`, `ObjectId`, soft-delete flags)
- Expose persistence facts, not policy

Example flow:

- Service requests a `User`
- Repository queries MongoDB
- Repository maps the document to a domain `User`
- Repository returns a validated, domain-safe object

Repositories never:

- Decide permissions
- Enforce authorization
- Contain business rules

This ensures:

- Database portability
- Testable business logic
- No persistence leakage into upper layers

---

### 5. Database Infrastructure (`apps/web/lib/db`)

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

### 6. Authentication & Identity

CodeSphere uses **Better Auth** as its authentication framework.

Authentication is treated as **infrastructure**, not business logic.

The system separates:

- **Authentication (AuthN)** → Who the user is
- **Authorization (AuthZ)** → What the user is allowed to do

#### Identity Modeling

Authentication data is intentionally separated from core user identity:

- `users` → domain identity
- `auth_identities` → provider-specific authentication records

This enables:

- Multiple providers per user
- Account linking
- Soft-disabling identities
- Deterministic session resolution

Authentication libraries do not define authorization rules — the domain does.

---

### 7. Testing Strategy

Testing is integrated at the domain layer first.

Tooling:

- **Vitest** (modern TypeScript-friendly test framework)

Testing principles:

- Deterministic unit tests for pure domain logic
- Behavioral allow/deny testing for authorization
- No mocking of internal policy maps
- No snapshot overuse
- Tests colocated with domain logic

Current coverage includes:

- Identity-based denial cases
- Role-based denial cases
- Scope-based denial cases
- Explicit allow (grant) cases
- Enforcement helper behavior

Domain logic is considered stable only after passing unit tests.

---

### 8. External Services (Planned)

External integrations are isolated behind service boundaries.

Planned services include:

- Online compiler APIs
- AI-assisted content generation
- Notification systems

Each service:

- Is accessed through a dedicated module
- Can be replaced without affecting domain logic

---

## Future Architecture Notes

- Realtime collaboration will be implemented as a separate Node.js service
- Database infrastructure may be extracted into a shared package once multiple consumers exist
- Business rule layer (invariants) will be implemented separately from authorization
- Abstractions are introduced only after real usage justifies them

Every abstraction must earn its existence.

---

## Architectural Philosophy

- Contracts before implementations
- Infrastructure is replaceable
- Authorization is deterministic and testable
- Policy is expressed as data
- Enforcement is centralized
- Business logic must remain pure
- Scaling should not require refactoring core domains

CodeSphere is designed to grow **without architectural regret**.
