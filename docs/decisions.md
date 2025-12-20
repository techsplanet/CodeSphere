
# Architectural Decisions Records (ADR)

This document records key architectural decisions made during the development of CodeSphere, along with their reasoning.

The goal is to make decisions **explicit, reviewable, and explainable**.

---

## ADR-001: Use a Monorepo Structure

**Decision**
Adopt a monorepo with `apps/` and `packages/`.

**Reasoning**

- Encourages shared contracts without duplication
- Makes cross-cutting concerns explicit
- Reflects real-world production repositories

**Alternatives Considered**

- Multiple repos → rejected due to coordination overhead

---

## ADR-002: Contract-First Design Using Shared Types

**Decision**
Define domain contracts in `packages/shared-types` before implementing features.

**Reasoning**

- Prevents type drift between UI, APIs, and database
- Enables safe evolution of persistence and services
- Makes system semantics explicit

**Outcome**

- Domain meaning is frozen early
- Implementations conform to contracts, not the reverse

---

## ADR-003: MongoDB Node.js Driver Over Mongoose

**Decision**
Use the official MongoDB Node.js driver instead of Mongoose.

**Reasoning**

- Domain contracts already exist (no need for ODM schemas)
- Avoids runtime incompatibilities with Edge
- Prevents schema duplication
- Improves hot-reload behavior during development

**Trade-offs**

- Manual schema alignment required
- More explicit repository logic

This trade-off is intentional.

---

## ADR-004: Repository Pattern for Data Access

**Decision**
All database access must go through repositories.

**Reasoning**

- Prevents database leakage into UI and APIs
- Enforces domain-safe data flow
- Enables future database replacement

**Rules**

- No ObjectId exposure
- No DB queries in routes or components
- Repositories return domain contracts only

---

## ADR-005: Database Infrastructure Inside apps/web (V1)

**Decision**
Place MongoDB connection logic in `apps/web/lib/db`.

**Reasoning**

- Only one consumer exists in V1
- Avoids premature shared infrastructure
- Keeps iteration speed high

**Future Plan**

- Extract to `packages/db` once multiple consumers exist

---

## ADR-006: Soft Deletes for Identity Data

**Decision**
Never hard-delete user or auth identity data in V1.

**Reasoning**

- Enables recovery
- Supports auditing
- Avoids irreversible data loss

**Implementation**

- `deletedAt` timestamp
- Repository-level filtering
