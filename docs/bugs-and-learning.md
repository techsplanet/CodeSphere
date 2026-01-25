# Bugs & Engineering Learnings

This document records **non-trivial engineering issues** encountered during the development of CodeSphere and how they were resolved.

The focus is on **architectural reasoning and boundary design**, not syntax-level mistakes.

---

## Bug-001: Auth Identity State Ambiguity

### Context

While implementing the authentication flow, the system needed to:

- Resolve an auth identity (provider → user mapping)
- Respect disabled / blocked auth identities
- Safely link auth identities to domain users
- Avoid recreating or reactivating blocked identities

---

### Problem

The repository layer exposed an **ambiguous contract**.

`resolveAuthIdentity()` returned `null` for multiple, semantically different cases:

- Auth identity does not exist (first-time login)
- Auth identity exists but is disabled

As a result, the auth layer could not reliably determine whether it should:

- Create a new user
- Block login
- Re-enable an identity
- Or fail authentication

---

### Root Cause

A **responsibility and intent violation at the repository boundary**:

- The repository filtered records using `disabledAt` at query time
- This caused **disabled identities to appear identical to non-existent ones**
- Important persistence facts were discarded too early
- A single `null` value represented multiple domain states

This forced the auth layer to **guess** persistence intent, breaking clean layering.

---

### Fix

The repository contract was redesigned to expose **explicit semantic outcomes**:

- Repository now retrieves records without filtering
- Persistence state is classified after retrieval
- The repository returns an explicit resolution instead of `null`

This change restored correct separation of concerns:

- Repository reports **facts**
- Auth layer enforces **policy**

---

### Outcome

- Authentication flow is fully deterministic
- Disabled identities are explicitly blocked
- New users are created only on true first login
- Security invariants are preserved
- Repository and auth boundaries are cleanly enforced

---

### Learning

> Repositories must communicate **facts**, not enforce **policy**.
> Ambiguous return values are architectural bugs, not convenience shortcuts.

This fix significantly improved the system’s correctness, security posture,
and long-term scalability.

---



## Bug-002: Auth Identity Resolution Mismatch (Sign-in vs Request-Time)

### Context

While wiring repositories into the authentication/session flow, an inconsistency surfaced between:

- How authentication libraries expose identity at **request time**
- How the repository layer expected identity to be resolved

At request time, the session correctly exposes only an opaque `authUserId`.
However, the repository API required `provider + providerUserId` to resolve identity.

### Problem

This caused both a TypeScript error and a deeper architectural contradiction:

- Repository APIs assumed provider details were always available
- Auth/session layer intentionally hides provider information after sign-in
- Identity resolution logic did not distinguish between:
  - sign-in time
  - request time

This revealed that the repository design supported only **one phase of authentication**.

### Root Cause

A missing distinction between two identity axes:

- **External identity**`provider + providerUserId`Used only during sign-in and account linking
- **Internal identity**
  `authUserId`
  Used for session continuity and request-time authorization

The repository contract implicitly assumed these were interchangeable, which they are not.

### Fix

- Clarified authentication as a two-phase process:
  - Sign-in phase (provider-centric)
  - Request-time phase (session-centric)
- Preserved provider-based resolution for sign-in
- Recognized the need for authUserId-based resolution for request-time flows
- Avoided leaking auth-library internals into repositories
- Kept repositories auth-library agnostic and policy-free

No shortcuts or implicit assumptions were introduced.

### Outcome

- Repository layer is now semantically correct
- Auth/session orchestration is deterministic
- Identity resolution scales to multiple providers per user
- Architecture aligns with real-world authentication systems

### Learning

> Authentication has **time-based semantics**.
> Identity data available during sign-in is not guaranteed to exist at request time, and system boundaries must respect that reality.


---
