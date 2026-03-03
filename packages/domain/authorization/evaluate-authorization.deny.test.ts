import { describe, it, expect } from "vitest";
import { evaluateAuthorization } from "./evaluate-authorization";
import {
  AuthorizationDenyReason,
  IdentityState,
  MembershipStatus,
  Permission,
  TeamRoles,
} from "../../shared-types";

describe("authorization – identity based denial", () => {
  const cases = [
    {
      name: "anonymous user cannot moderate discussion",
      request: {
        subject: { identityState: IdentityState.NotFound },
        permission: Permission.DiscussionModerate,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.IdentityNotFound,
    },

    {
      name: "anonymous user cannot create team",
      request: {
        subject: { identityState: IdentityState.NotFound },
        permission: Permission.TeamCreate,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.IdentityNotFound,
    },

    {
      name: "disabled user cannot create playlist",
      request: {
        subject: { identityState: IdentityState.Disabled },
        permission: Permission.PlaylistCreate,
        scope: { kind: "team", teamId: "team-1" },
        teamContext: {
          teamId: "team-1",
          membershipStatus: MembershipStatus.Active,
          teamRole: TeamRoles.Member,
        },
      },
      expectedReason: AuthorizationDenyReason.IdentityDisabled,
    },

    {
      name: "denies baseline access for disabled user",
      request: {
        subject: { identityState: IdentityState.Disabled },
        permission: Permission.PlatformAccess,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.IdentityDisabled,
    },
  ];

  cases.forEach(({ name, request, expectedReason }) => {
    it(name, () => {
      const decision = evaluateAuthorization(request as any);

      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toBe(expectedReason);
      }
    });
  });
});

describe("authorization - role based denial", () => {
  const cases = [
    {
      name: "denies playlist:edit for active user without system role",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.PlaylistEdit,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.PermissionMissing,
    },
    {
      name: "denies team:delete for active user without system role",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.TeamDelete,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.PermissionMissing,
    },
    {
      name: "denies team:update_settings in global scope",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.TeamUpdateSettings,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.PermissionMissing,
    },
    {
      name: "denies discussion:moderate in global scope",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.DiscussionModerate,
        scope: { kind: "global" },
      },
      expectedReason: AuthorizationDenyReason.PermissionMissing,
    },
  ];

  cases.forEach(({ name, request, expectedReason }) => {
    it(name, () => {
      const decision = evaluateAuthorization(request as any);
      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toBe(expectedReason);
      }
    });
  });
});

describe("authorization – scope based denial", () => {
  const cases = [
    {
      name: "denies team-scoped permission without teamContext",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.PlaylistCreate,
        scope: { kind: "team", teamId: "team-1" },
      },
      expectedReason: AuthorizationDenyReason.InvalidScope,
    },
    {
      name: "denies team-scoped permission without active membership",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.PlaylistCreate,
        scope: { kind: "team", teamId: "team-1" },
        teamContext: { membershipStatus: MembershipStatus.Invited },
      },
      expectedReason: AuthorizationDenyReason.MembershipNotActive,
    },
  ];

  cases.forEach(({ name, request, expectedReason }) => {
    it(name, () => {
      const decision = evaluateAuthorization(request as any);
      expect(decision.allowed).toBe(false);
      if (!decision.allowed) {
        expect(decision.reason).toBe(expectedReason);
      }
    });
  });
});
