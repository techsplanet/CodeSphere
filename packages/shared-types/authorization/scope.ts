import { z } from "zod";
import { TeamIdSchema } from "../core/ids";

/**
 * Authorization scope explicitly declares where a permission applies.
 */

export const GlobalScopeSchema = z.object({
  kind: z.literal("global"),
});

export const TeamScopeSchema = z.object({
  kind: z.literal("team"),
  teamId: TeamIdSchema,
});

export const AuthorizationScopeSchema = z.discriminatedUnion("kind", [
  GlobalScopeSchema,
  TeamScopeSchema,
]);

export type GlobalScope = z.infer<typeof GlobalScopeSchema>;
export type TeamScope = z.infer<typeof TeamScopeSchema>;
export type AuthorizationScope = z.infer<typeof AuthorizationScopeSchema>;