import {
  AuthorizationRequest,
  AuthorizationDecision,
  AuthorizationDenyReason,
} from "../../shared-types";
import {
  TEAM_ROLE_PERMISSIONS,
  SYSTEM_ROLE_PERMISSIONS,
} from "./permissions-map";

export function evaluateAuthorization(
  request: AuthorizationRequest
): AuthorizationDecision {

  const { subject, permission, scope, teamContext } = request;

  // 1️⃣ Identity checks (always first)
  if (subject.identityState === "not_found") {
    return { allowed: false, reason: AuthorizationDenyReason.IdentityNotFound };
  }

  if (subject.identityState === "disabled") {
    return { allowed: false, reason: AuthorizationDenyReason.IdentityDisabled };
  }

  // 2️⃣ Global scope
  if (scope.kind === "global") {
    if (!subject.systemRole) {
      return {
        allowed: false,
        reason: AuthorizationDenyReason.PermissionMissing,
      };
    }

    const allowedPermissions =
      SYSTEM_ROLE_PERMISSIONS[subject.systemRole] ?? [];

    return allowedPermissions.includes(permission)
      ? { allowed: true }
      : {
          allowed: false,
          reason: AuthorizationDenyReason.PermissionMissing,
        };
  }

  // 3️⃣ Team scope
  if (!teamContext) {
    return {
      allowed: false,
      reason: AuthorizationDenyReason.InvalidScope,
    };
  }

  if (teamContext.membershipStatus !== "active") {
    return {
      allowed: false,
      reason: AuthorizationDenyReason.MembershipNotActive,
    };
  }

  const rolePermissions =
    TEAM_ROLE_PERMISSIONS[teamContext.teamRole] ?? [];

  return rolePermissions.includes(permission)
    ? { allowed: true }
    : {
        allowed: false,
        reason: AuthorizationDenyReason.PermissionMissing,
      };
}