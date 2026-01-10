
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
