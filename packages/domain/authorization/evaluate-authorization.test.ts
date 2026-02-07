import { describe, it, expect } from "vitest";
import { evaluateAuthorization } from "./evaluate-authorization";
import {
  AuthorizationDenyReason,
  IdentityState,
  Permission,
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
          membershipStatus: "active",
          teamRole: "member",
        },
      },
      expectedReason: AuthorizationDenyReason.IdentityDisabled,
    },
  ];

  cases.forEach(({ name, request, expectedReason }) => {
    it(name, () => {
      const decision = evaluateAuthorization(request as any);

      expect(decision.allowed).toBe(false);
      expect(decision.reason).toBe(expectedReason);
    });
  });
});
