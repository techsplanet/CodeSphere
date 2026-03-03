import { describe, expect, it } from "vitest";

import {
  Permission,
  IdentityState,
  SystemRole,
  MembershipStatus,
  TeamRoles,
} from "../../shared-types";
import { evaluateAuthorization } from "./evaluate-authorization";

describe("authorization – explicit grant (allow)", () => {
  const cases = [
    {
      name: "allows platform_moderator to moderate content",
      request: {
        subject: {
          identityState: IdentityState.Active,
          systemRole: SystemRole.PlatformModerator,
        },
        permission: Permission.PlatformModerateContent,
        scope: { kind: "global" },
      },
    },
    {
      name: "allows admin to invite member within team",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.TeamInviteMember,
        scope: { kind: "team", teamId: "team-1" },
        teamContext: {
          teamId: "team-1",
          membershipStatus: MembershipStatus.Active,
          teamRole: TeamRoles.Admin,
        },
      },
    },
    {
      name: "allows viewer to view playlist within team",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.PlaylistView,
        scope: {
          kind: "team",
          teamId: "team-1",
        },
        teamContext: {
          teamId: "team-1",
          membershipStatus: MembershipStatus.Active,
          teamRole: TeamRoles.Viewer,
        },
      },
    },
    {
      name: "allows owner to remove member within team",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.TeamRemoveMember,
        scope: {
          kind: "team",
          teamId: "team-1",
        },
        teamContext: {
          teamId: "team-1",
          membershipStatus: MembershipStatus.Active,
          teamRole: TeamRoles.Owner,
        },
      },
    },
    {
      name: "allows active user baseline platform access",
      request: {
        subject: { identityState: IdentityState.Active },
        permission: Permission.PlatformAccess,
        scope: { kind: "global" },
      },
    },
  ];

  cases.forEach(({ name, request }) => {
    it(name, () => {
      console.log("request - ", request);
      const decision = evaluateAuthorization(request as any);
      console.log("decision = ", decision);

      expect(decision.allowed).toBe(true);
    });
  });
});
