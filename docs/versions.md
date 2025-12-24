# CodeSphere — Version Roadmap

This document defines the intentional, staged evolution of CodeSphere.

Each version is:

- Independently shippable
- Risk-contained
- Designed to teach one major system concept at a time

The roadmap prioritizes correctness, learning velocity, and architectural clarity
over feature density.

---

## V1 — Solo Practice Foundation

**Goal**
Establish a rock-solid, production-grade foundation using a single-user workflow.

**Includes**

- Authentication (Auth.js)
- Core user identity
- MongoDB persistence with repository pattern
- Contract-first architecture (shared-types)
- Online compiler integration
- Code submissions (single user)
- Basic progress tracking

**Excludes**

- Teams
- Collaboration
- Sessions
- Realtime features

**Why**
Validates the entire system pipeline (auth → data → execution → persistence)
without collaboration complexity.

---

## V2 — Structured Practice & Coding Sheets

**Goal**
Introduce structured, asynchronous learning.

**Includes**

- Coding sheets (user-owned)
- Ordered problem sets
- Public / private sheet visibility
- Sheet reuse and sharing (read-only)
- Improved progress tracking

**Excludes**

- Teams
- Live sessions
- Realtime

**Why**
Strong async practice is a prerequisite for meaningful collaboration later.

---

## V3 — Teams & Shared Ownership

**Goal**
Introduce collaboration without time-based pressure.

**Includes**

- Teams
- Team membership & roles
- Team-owned coding sheets
- Permission-based access control

**Excludes**

- Timed sessions
- Realtime collaboration

**Why**
Separates collaboration modeling from session complexity.

---

## V4 — Timed Coding Sessions

**Goal**
Enable focused, time-bound problem-solving.

**Includes**

- Timed coding sessions
- Session configuration (AI usage, code pasting, chat toggle)
- Session history & re-attempts
- Session-level permissions

**Excludes**

- Realtime sync
- Voice / screen sharing

**Why**
Sessions are product features — realtime is an infrastructure multiplier and
is intentionally deferred.

---

## V5 — Realtime Collaboration & AI Tooling

**Goal**
Enhance sessions with realtime interaction and AI-assisted tooling.

**Includes**

- Realtime chat
- Presence indicators
- Optional live code sync
- AI for content tooling (problem generation, test cases, review assistance)

**Why**
Realtime and AI are introduced only after core workflows are proven stable.

---

## V6 — Analytics & Platform Maturity

**Goal**
Make CodeSphere production-ready at scale.

**Includes**

- Advanced progress analytics
- Team and individual dashboards
- Notifications
- Audit logs
- Admin tooling
- Performance optimization
- Infrastructure hardening

---

## Versioning Philosophy

- No version assumes future versions exist
- No feature is added before its prerequisites are stable
- Complexity grows only when justified by product maturity

---
