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

## ADR-009: Testing Framework Selection (Vitest)

**Decision**
Adopt **Vitest** as the testing framework for CodeSphere, with a deliberately restricted usage model.

**Context**

CodeSphere is a domain-first, monorepo-based project with strong separation between:

- domain logic
- repositories
- infrastructure
- application layers

The project requires:

- deterministic tests for pure domain logic (authorization, invariants)
- strong TypeScript integration
- interview-defensible tooling choices
- long-term maintainability without premature complexity

At the time of this decision:

- no tests have been implemented yet
- the authorization engine is complete and ready to be locked with tests
- testing is being introduced incrementally for the first time in the project

**Alternatives Considered**

1. **Custom test runner**

   - Rejected: educational but not production-grade
   - Lacks isolation, reporting, CI ergonomics
2. **Node.js built-in test runner (`node:test`)**

   - Technically sound
   - Rejected for now due to limited ecosystem familiarity and onboarding friction
3. **Vitest**

   - Selected

**Reasoning**

Vitest provides:

- industry-standard testing semantics (`describe / it / expect`)
- excellent TypeScript support
- monorepo friendliness
- fast feedback and clear failure output

To avoid overengineering, the project intentionally limits Vitest usage.

**Usage Constraints (Non-Negotiable)**

Vitest will be used with the following rules:

- Only `describe`, `it`, and `expect` are allowed
- No mocks, spies, snapshots, or fake timers
- Tests must be deterministic and side-effect free
- Tests target pure domain logic first (authorization, repositories)

This ensures learning correctness and architectural discipline without hiding behavior behind tooling magic.

**Outcome**

- Testing is introduced as a first-class engineering concern
- Authorization logic will be locked with unit tests before integration
- The testing approach remains transferable to real-world teams and interviews

**Future Notes**

- Additional testing layers (integration, API) may be added in later versions
- This decision may be revisited only if project scale demands it

---

## ADR-010: File-Based Problem Bank for V1 (Static JSON Content)

### Decision

Store coding problems locally as structured JSON files inside the repository
(e.g., `packages/problem-bank/`) instead of persisting problem content in MongoDB.

MongoDB will store only dynamic user-generated data:

- submissions
- progress tracking
- user data
- identity data

Problem descriptions, starter code, and hidden test cases will NOT be stored in the database for V1.

---

### Context

CodeSphere V1 requires a deterministic, production-grade problem system.

Constraints:

- MongoDB Atlas free tier is being used
- V1 is single-user focused
- Problems are static content (not user-generated)
- Deterministic judging is required
- Hidden test cases must remain server-only

Using the database for static problem content was evaluated but deemed unnecessary for V1.

---

### Reasoning

Problems are static, version-controlled content — not operational data.

Storing them in the database would:

- Increase storage usage unnecessarily
- Add avoidable database read overhead
- Couple static content to persistence infrastructure
- Introduce migration complexity for immutable content

Storing problems as JSON files provides:

- Zero additional database cost
- Version control via Git
- Deterministic, immutable problem definitions
- Faster local development
- Clean separation between static content and dynamic state
- Infrastructure independence

This design demonstrates strong separation of concerns:

- **Content Layer** → File-based JSON problem bank
- **Operational Layer** → MongoDB (users, submissions, progress)

---

### Architectural Implications

1. A `ProblemRepository` abstraction will be introduced.
2. V1 will use a `FileProblemRepository` implementation.
3. Future versions may introduce a `MongoProblemRepository`
   without modifying the service layer.
4. Service layer must never expose hidden test cases.
5. Two representations must exist:
   - PublicProblem (no hidden data)
   - InternalProblem (includes hidden test cases)

Hidden test cases must never be bundled into client-side code.

---

### Trade-offs

- No runtime problem creation in V1
- No admin editing UI
- Content updates require repository changes (intentional)
- File reading must remain server-side only

These trade-offs are acceptable for V1 and reinforce deterministic system behavior.

---

### Alternatives Considered

1. **Store problems in MongoDB**

   - Rejected due to unnecessary coupling and storage use
   - Adds database read overhead for static content
2. **Generate problems dynamically using LLM (Gemini)**

   - Rejected due to non-determinism
   - Cannot guarantee full edge-case coverage
   - Legally risky when referencing third-party platforms
   - Not production-grade for canonical judging
3. **Mirror external platforms (LeetCode, etc.)**

   - Rejected due to copyright and terms-of-service risks
   - Creates dependency on external systems

---

### Outcome

- V1 problem system becomes deterministic and infrastructure-light
- Database usage is minimized and focused on dynamic state
- Architecture remains storage-agnostic and future-extensible
- System design remains interview-defensible and production-grade

This decision strengthens architectural clarity and long-term scalability
without increasing infrastructure cost.

---
