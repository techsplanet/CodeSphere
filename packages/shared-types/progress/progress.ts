import {z} from "zod";
import { UserIdSchema } from "../core/ids";
import { NullableTimestampSchema, TimestampSchema } from "../core/timestamps";
import { ProgressContextSchema } from "../enums";

export const ProgressSnapshotSchema = z.object({
    userId: UserIdSchema,
    contextType: ProgressContextSchema,
    contextId: z.string().trim(),
    solvedCount: z.number().int().gte(0),
    attemptedCount: z.number().int(),  // enforce attemptedCount >= solvedCount in applicaton logic.
    accuracy: z.number().min(0).max(100),
    lastSolvedAt: NullableTimestampSchema,
    updatedAt: TimestampSchema
});

export const ProgressRefSchema = ProgressSnapshotSchema.pick({
    userId: true,
    solvedCount: true,
    accuracy: true,
    updatedAt: true
});

export const UpdateProgressInputSchema = ProgressSnapshotSchema.omit({
    accuracy: true,
    updatedAt: true
}).partial();


// ---types---

export type ProgressSnapshot = z.infer<typeof ProgressSnapshotSchema>
export type ProgressRef = z.infer<typeof ProgressRefSchema>
export type UpdateProgressInput = z.infer<typeof UpdateProgressInputSchema>
