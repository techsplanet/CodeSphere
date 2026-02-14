import { describe, it, expect } from "vitest";

import { requirePermission } from "./require-permission";
import { AuthorizationError } from "./authorization-error";

import {
  IdentityState,
  Permission,
  SystemRole,
  AuthorizationDenyReason,
  AuthorizationRequest,
} from "../../shared-types";

describe("requirePermission – enforcement bridge", () => {
  
  it("does not throw when permission is allowed", () => {
    const request: AuthorizationRequest = {
      subject: {
        identityState: IdentityState.Active,
        systemRole: SystemRole.PlatformModerator,
      },
      permission: Permission.PlatformModerateContent,
      scope: { kind: "global" },
    };

    expect(() => requirePermission(request)).not.toThrow();
  });

  
  it("throws AuthorizationError when permission is denied", () => {
    const request: AuthorizationRequest = {
      subject: {
        identityState: IdentityState.NotFound,
      },
      permission: Permission.TeamDelete,
      scope: { kind: "global" },
    };

    expect(() => requirePermission(request)).toThrow(AuthorizationError);
  });

  
  it("preserves the exact AuthorizationDenyReason in the thrown error", () => {
    const request: AuthorizationRequest = {
      subject: {
        identityState: IdentityState.NotFound,
      },
      permission: Permission.TeamDelete,
      scope: { kind: "global" },
    };

    try {
      requirePermission(request);
      throw new Error("Expected requirePermission to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(AuthorizationError);

      const authError = error as AuthorizationError;

      expect(authError.reason).toBe(
        AuthorizationDenyReason.IdentityNotFound
      );
    }
  });

  
  it("throws for denied team-scoped permission", () => {
    const request: AuthorizationRequest = {
      subject: {
        identityState: IdentityState.Active,
      },
      permission: Permission.TeamDelete,
      scope: { kind: "global" },
    };

    expect(() => requirePermission(request)).toThrow(AuthorizationError);
  });
});
