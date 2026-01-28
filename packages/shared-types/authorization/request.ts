import { z } from "zod";
import { AuthorizationSubjectSchema } from "./subject";
import { PermissionSchema } from "./permissions";
import { AuthorizationScopeSchema } from "./scope";
import { MembershipStatusSchema, TeamRolesSchema } from "../enums";
import { TeamIdSchema } from "../core/ids";

/**
 * Team authority facts, required only for team-scoped checks.
 */
export const TeamAuthorityContextSchema = z.object({
  teamId: TeamIdSchema,
  membershipStatus: MembershipStatusSchema,
  teamRole: TeamRolesSchema,
});

/**
 * Authorization request.
 * This is the ONLY input to the authorization engine.
 */
export const AuthorizationRequestSchema = z.object({
  subject: AuthorizationSubjectSchema,
  permission: PermissionSchema,
  scope: AuthorizationScopeSchema,
  teamContext: TeamAuthorityContextSchema.optional(),
}).superRefine((value, ctx) => {
  if (value.scope.kind === "team" && !value.teamContext) {
    ctx.addIssue({
      code: "custom",
      message: "teamContext is required for team scope",
    });
  }

  if (value.scope.kind === "global" && value.teamContext) {
    ctx.addIssue({
      code: "custom",
      message: "teamContext must not be provided for global scope",
    });
  }
});

export type TeamAuthorityContext = z.infer<
  typeof TeamAuthorityContextSchema
>;
export type AuthorizationRequest = z.infer<
  typeof AuthorizationRequestSchema
>;