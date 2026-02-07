# Authorization Test Specification

This document defines **non-negotiable authorization rules** for CodeSphere.
All authorization logic must conform to the scenarios listed below.

This file acts as:

- A security contract
- A test specification
- A long-term reference for audits and interviews

---

## Section A: Forbidden Scenarios (Strict Deny)

These actions must **never** be allowed.

| Identity State | Role   | Scope      | Permission              | Expected | Forbidden Reason                                                                                                                       |
| -------------- | ------ | ---------- | ----------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| active         | Member | global     | team:delete             | DENY     | This must never be allowed because destructive global actions must be restricted to platform-level administrators.                     |
| active         | Member | team       | team:change_member_role | DENY     | This must never be allowed because non-admin members should not be able to escalate their own privileges or demote others.             |
| suspended      | Member | playlist   | playlist:create         | DENY     | This must never be allowed because accounts flagged for violations must have all write access revoked to prevent platform abuse.       |
| active         | Viewer | playlist   | playlist:edit           | DENY     | This must never be allowed because users with read-only roles must not be permitted to modify existing resources.                      |
| active         | Member | global     | platform:suspend_user   | DENY     | This must never be allowed because account suspension is a high-trust administrative action reserved for platform moderators.          |
| null (Anon)    | none   | discussion | discussion:moderate     | DENY     | This must never be allowed because anonymous users lack the identity and accountability required to moderate community content.        |
| active         | Member | team       | team:update_settings    | DENY     | This must never be allowed because core team configurations should only be manageable by those with explicit administrative authority. |
| null (Anon)    | none   | global     | team:create             | DENY     | This must never be allowed because unauthenticated users should not be able to provision resources and bloat the database.             |

---

## Section B: Allowed Scenarios (Explicit Grant)

These actions are **explicitly permitted**.

| Identity State | Role      | Scope      | Permission                | Expected |
| -------------- | --------- | ---------- | ------------------------- | -------- |
| active         | Admin     | team       | team:invite_member        | ALLOW    |
| active         | Member    | discussion | discussion:create         | ALLOW    |
| active         | Viewer    | playlist   | playlist:view             | ALLOW    |
| active         | Owner     | team       | team:remove_member        | ALLOW    |
| active         | Moderator | global     | platform:moderate_content | ALLOW    |
| active         | Member    | team       | team:view_analytics       | ALLOW    |

---

## Enforcement Rules

- Authorization must never throw
- All decisions must be deterministic
- Invalid or unknown states default to DENY
- Repositories must not enforce authorization
- Authorization logic must be testable in isolation

---
