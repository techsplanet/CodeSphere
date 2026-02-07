import { z } from "zod";

/**
 * Identity state as seen by authorization.
 * Mirrors semantics from identity layer without importing domain user.
 */
export enum IdentityState {
  Active = "active",
  Disabled = "disabled",
  NotFound = "not_found",
}

export const IdentityStateSchema = z.enum(IdentityState);

/**
 * System-level roles (orthogonal to team roles).
 */
export enum SystemRole {
  PlatformModerator = "platform_moderator",
  PlatformAdmin = "platform_admin",
}

export const SystemRoleSchema = z.enum(SystemRole);

/**
 * Authorization subject (actor).
 */
export const AuthorizationSubjectSchema = z.object({
  identityState: IdentityStateSchema,
  systemRole: SystemRoleSchema.optional(),
});

export type AuthorizationSubject = z.infer<
  typeof AuthorizationSubjectSchema
>;