import { z } from "zod";

/**
 * Machine-facing denial reasons.
 * Used for logs, audits, tests, and metrics.
 */
export enum AuthorizationDenyReason {
  IdentityNotFound = "identity_not_found",
  IdentityDisabled = "identity_disabled",
  InvalidScope = "invalid_scope",
  NoTeamMembership = "no_team_membership",
  MembershipNotActive = "membership_not_active",
  PermissionMissing = "permission_missing",
}

export const AuthorizationDenyReasonSchema = z.nativeEnum(
  AuthorizationDenyReason
);

/**
 * Authorization decision.
 * Authorization NEVER throws — it always returns a decision.
 */
export const AuthorizationDecisionSchema = z.discriminatedUnion("allowed", [
  z.object({
    allowed: z.literal(true),
  }),
  z.object({
    allowed: z.literal(false),
    reason: AuthorizationDenyReasonSchema,
  }),
]);

export type AuthorizationDecision = z.infer<
  typeof AuthorizationDecisionSchema
>;