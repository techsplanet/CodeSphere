import {z} from "zod";
import { TeamIdSchema, UserIdSchema } from "../core/ids";
import { TimestampSchema } from "../core/timestamps";
import { TeamVisibilitySchema } from "../enums";

export const TeamSchema = z.object({
    id: TeamIdSchema,
    name: z.string().trim().min(3).max(64),
    slug: z.string().trim().lowercase(),
    ownerId: UserIdSchema,
    visibility: TeamVisibilitySchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    isArchived: z.boolean()
});

export const TeamRefSchema = TeamSchema.pick({
    id: true,
    name: true,
    slug: true
});

export const CreateTeamInputSchema = TeamSchema.pick({
    name: true,
    slug: true,
    visibility: true,
});

export const UpdateTeamInputSchema = TeamSchema.omit({
    id: true,
    ownerId: true,
    createdAt: true
}).partial();


// infering types for use in application logica

export type Team = z.infer<typeof TeamSchema>
export type TeamRef = z.infer<typeof TeamRefSchema>
export type CreateTeamInput = z.infer<typeof CreateTeamInputSchema>
export type UdateTeamInput = z.infer<typeof UpdateTeamInputSchema>

