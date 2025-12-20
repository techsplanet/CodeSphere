import {z} from "zod";
import {TeamIdSchema, UserIdSchema} from "../core/ids";
import {UserRefSchema} from "../identity/user";
import { NullableTimestampSchema, TimestampSchema } from "../core/timestamps";
import { MembershipStatusSchema, TeamRolesSchema } from "../enums";

const roles = TeamRolesSchema;

export const TeamMembershipSchema = z.object({
    teamId: TeamIdSchema,
    userId: UserIdSchema,
    role: roles,
    status: MembershipStatusSchema,
    joinedAt: TimestampSchema,
    leftAt: NullableTimestampSchema
});

export const TeamMemberRefSchema = z.object({
    user: UserRefSchema,
    role: roles,
    joinedAt: TimestampSchema
});

export const InviteMemberInputSchema = TeamMembershipSchema.pick({
    teamId: true,
    userId: true,
    role: true
});

export const UpdateMemberRoleInputSchema = InviteMemberInputSchema;

export const RemoveMemberInputSchema = TeamMembershipSchema.pick({
    teamId: true,
    userId: true
});

// infer types for use in applicatoin logic.

export type TeamMembership = z.infer<typeof TeamMembershipSchema>;
export type TeamMemberRef = z.infer<typeof TeamMemberRefSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberInputSchema>;
export type UpdateMemberRoleInput = z.infer<typeof UpdateMemberRoleInputSchema>;
export type RemoveMemberInput = z.infer<typeof RemoveMemberInputSchema>;