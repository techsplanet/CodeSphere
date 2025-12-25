# Architectural Decision Records (ADR)

This document records key architectural decisions made during the development of CodeSphere, along with their reasoning.

The goal is to make decisions **explicit, reviewable, and explainable**, both for future maintainers and external reviewers.

---

## ADR-001: Use a Monorepo Structure

**Decision**
Adopt a monorepo with `apps/` and `packages/`.

**Reasoning**

- Encourages shared contracts without duplication
- Makes cross-cutting concerns explicit
- Reflects real-world production repositories

**Alternatives Considered**

- Multiple repositories → rejected due to coordination overhead

---

## ADR-002: Contract-First Design Using Shared Types

**Decision**
Define domain contracts in `packages/shared-types` before implementing features.

**Reasoning**

- Prevents type drift between UI, APIs, and persistence
- Enables safe evolution of database and services
- Makes system semantics explicit and reviewable

**Outcome**

- Domain meaning is frozen early
- Implementations conform to contracts, not the reverse
- Zod schemas act as the single source of truth

---

## ADR-003: MongoDB Node.js Driver Over Mongoose

**Decision**
Use the official MongoDB Node.js driver instead of Mongoose.

**Reasoning**

- Domain contracts already exist (no need for ODM schemas)
- Avoids runtime incompatibilities with Edge environments
- Prevents schema duplication between ODM and domain layer
- Improves hot-reload behavior during development

**Trade-offs**

- Manual document-to-domain mapping required
- Repository logic becomes more explicit

This trade-off is intentional to gain architectural clarity and control.

---

## ADR-004: Repository Pattern for Data Access

**Decision**
All database access must go through repositories.

**Reasoning**

- Prevents database-specific concepts from leaking upward
- Enforces domain-safe data flow
- Centralizes persistence behavior
- Enables future database replacement without refactoring UI or APIs

**Rules**

- No `ObjectId` exposure outside repositories
- No database queries in routes or components
- Repositories return validated domain contracts only

---

## ADR-005: Database Infrastructure Inside apps/web (V1)

**Decision**
Place MongoDB connection logic in `apps/web/lib/db` for Version 1.

**Reasoning**

- Only a single consumer exists in V1
- Avoids premature shared infrastructure extraction
- Keeps iteration speed high while maintaining clean boundaries

**Future Plan**

- Extract database infrastructure to `packages/db` once multiple consumers exist
- Reuse repositories without architectural changes

---

## ADR-006: Soft Deletes for Identity Data

**Decision**
Never hard-delete user or authentication identity data in V1.

**Reasoning**

- Enables recovery from accidental deletion
- Supports auditing and debugging
- Avoids irreversible data loss in early-stage systems

**Implementation**

- `deletedAt` / `disabledAt` timestamps
- Repository-level filtering
- Idempotent delete and disable operations

---

## ADR-007: Domain Validation at Repository Boundary

**Decision**
Validate all data returned from repositories against domain contracts.

**Reasoning**

- Ensures persistence always conforms to domain meaning
- Prevents corrupt or partial data from leaking upward
- Makes repository layer a hard enforcement boundary

**Outcome**

- Domain invariants are guaranteed at compile-time and runtime
- Upper layers never need to defensively re-validate data
- Persistence remains an implementation detail

---

## ADR-008: Use Better Auth Instead of Auth.js

##### Decision

Use **Better Auth** as the authentication framework for CodeSphere instead of Auth.js.

##### Context

Authentication is a core infrastructural concern in CodeSphere, but it is  **not part of the domain logic** .

Auth.js was evaluated due to its popularity and feature richness. However, during architectural review, it was found to introduce significant complexity and framework-specific abstraction that obscured authentication fundamentals—especially for early-stage, contract-first development.

---

##### Reasoning

Better Auth was selected because it:

* Preserves core authentication concepts (sessions, cookies, OAuth)
* Provides a simpler and more explicit mental model
* Avoids excessive framework-driven ceremony
* Improves debuggability and readability
* Enables faster, safer iteration during V1–V3
* Keeps authentication explainable in interviews and system design discussions

This decision prioritizes **conceptual clarity and correctness** over maximal configurability.

---

##### Trade-offs

* Fewer advanced customization hooks compared to Auth.js
* Less flexibility for highly specialized authentication workflows

These trade-offs are **intentional and acceptable** for the current scope of the project.

---

##### Outcome

* Authentication remains an infrastructure concern, not a domain dependency
* Core domain contracts stay independent of the auth framework
* The system remains production-grade, evolvable, and interview-defensible
* The authentication layer can be replaced in the future without refactoring domain logic

---
