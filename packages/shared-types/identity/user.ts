import {z} from "zod";
import { UserIdSchema } from "../core/ids";
import { OptionalTimestampSchema, TimestampSchema } from "../core/timestamps";
import { UserStatusSchema } from "../enums";

// Define the canonical ( means - single source of truth or master definition ) User domain contract used by : UI, APIs, Sessions, Teams, Progress, Realtime server (future planned versions), etc...

export const UserSchema = z.object({
    id: UserIdSchema,
    username: z.string().trim().lowercase().min(3).max(30),
    displayName: z.string().trim().min(1).max(64),
    avatarUrl: z.url().optional(),
    status: UserStatusSchema,
    createdAt: TimestampSchema,
    lastActiveAt: OptionalTimestampSchema
});

export const UserRefSchema = UserSchema.pick({
    id: true,
    displayName: true,
    avatarUrl: true
});

export const CreateUserInputSchema = UserSchema.pick({
    username: true,
    displayName: true,
    avatarUrl: true,
});

export const UpdateUserInputSchema = UserSchema.omit({
    id: true,
    createdAt: true,
    status: true,
}).partial();


// inferring the types for use in application logic
export type User = z.infer<typeof UserSchema>;
export type UserRef = z.infer<typeof UserRefSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
