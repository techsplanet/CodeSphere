# Authorization Test Specification

This document defines **non-negotiable authorization rules** for CodeSphere.

All authorization logic must conform to the scenarios listed below.

This file serves as:

- A security contract
- A unit test specification
- A long-term audit reference
- An interview-grade explanation of the system’s authorization model

The terminology in this document strictly matches the implemented engine.

---

# Authorization Model Alignment

The authorization engine supports:

- `identityState`: `active` | `disabled` | `not_found`
- `systemRole`: `platform_admin` | `platform_moderator` | undefined
- `teamRole`: `owner` | `admin` | `member` | `viewer`
- `scope`: `global` | `team`

Feature concepts like `playlist` and `discussion` are represented as **permissions**, not scopes.

---

## Section A: Forbidden Scenarios (Strict Deny)

These actions must **never** be allowed.

| identityState | systemRole | teamRole  | membershipStatus | scope  | permission              | Expected | Forbidden Reason                                                                           |
| ------------- | ---------- | --------- | ---------------- | ------ | ----------------------- | -------- | ------------------------------------------------------------------------------------------ |
| active        | undefined  | member    | active           | global | team:delete             | DENY     | Destructive global actions must be restricted to platform-level administrators.            |
| active        | undefined  | member    | active           | team   | team:change_member_role | DENY     | Non-admin members must not escalate privileges or demote others.                           |
| disabled      | undefined  | member    | active           | team   | playlist:create         | DENY     | Disabled accounts must have all write access revoked.                                      |
| active        | undefined  | viewer    | active           | team   | playlist:edit           | DENY     | Read-only roles must not modify existing resources.                                        |
| active        | undefined  | member    | active           | global | platform:suspend_user   | DENY     | Account suspension is a high-trust administrative action reserved for platform moderators. |
| not_found     | undefined  | undefined | undefined        | global | discussion:moderate     | DENY     | Unauthenticated users lack the identity required for moderation actions.                   |
| active        | undefined  | member    | active           | team   | team:update_settings    | DENY     | Core team settings require explicit administrative authority.                              |
| not_found     | undefined  | undefined | undefined        | global | team:create             | DENY     | Unauthenticated users must not provision persistent resources.                             |

---

## Section B: Allowed Scenarios (Explicit Grant)

These actions are **explicitly permitted**.

| identityState | systemRole         | teamRole  | membershipStatus | scope  | permission                | Expected |
| ------------- | ------------------ | --------- | ---------------- | ------ | ------------------------- | -------- |
| active        | undefined          | admin     | active           | team   | team:invite_member        | ALLOW    |
| active        | undefined          | member    | active           | team   | discussion:create         | ALLOW    |
| active        | undefined          | viewer    | active           | team   | playlist:view             | ALLOW    |
| active        | undefined          | owner     | active           | team   | team:remove_member        | ALLOW    |
| active        | platform_moderator | undefined | undefined        | global | platform:moderate_content | ALLOW    |
| active        | undefined          | member    | active           | team   | team:view_analytics       | ALLOW    |

---

## Enforcement Rules

- Authorization must never throw.
- All decisions must be deterministic.
- Unknown or invalid states must default to DENY.
- Repositories must not enforce authorization policy.
- Authorization must remain pure domain logic.
- Tests must assert allow/deny outcomes explicitly.

---

## Extension Rule

Any new permission added to the system must:

1. Be added to the permission vocabulary.
2. Be mapped in role → permission policy.
3. Be reflected in this document.
4. Be covered by at least one unit test.

No permission is considered production-ready without updating this file.
