import {z} from "zod";
import { SheetIdSchema, SessionIdSchema } from "../core/ids";
import { OwnershipSchema } from "../core/ownership";
import { TimestampSchema, NullableTimestampSchema } from "../core/timestamps";
import { SessionStatusSchema } from "../enums";


export const SessionConfigSchema = z.object({
    allowAI: z.boolean(),
    allowChat: z.boolean(),
    allowPaste: z.boolean()
});


export const CodingSessionSchema = z.object({
    id: SessionIdSchema,
    sheetId: SheetIdSchema,
    ownership: OwnershipSchema,
    status: SessionStatusSchema,
    scheduledAt: TimestampSchema,
    startedAt: NullableTimestampSchema,
    endedAt: NullableTimestampSchema,
    config:  SessionConfigSchema,
    createdAt: TimestampSchema
});

export const CreateSessionInputSchema = CodingSessionSchema.pick({
    sheetId: true,
    ownership: true,
    scheduledAt: true,
    config: true
});


// ---types---

export type SessionConfig = z.infer<typeof SessionConfigSchema>
export type CodingSession = z.infer<typeof CodingSessionSchema> 
export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema> 