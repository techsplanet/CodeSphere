import {z} from "zod";
import { SessionIdSchema, UserIdSchema } from "../core/ids";
import { SessionParticipantRoleSchema } from "../enums";
import { NullableTimestampSchema, TimestampSchema } from "../core/timestamps";


export const SessionParticipantSchema = z.object({
    sessionId: SessionIdSchema,
    userId: UserIdSchema,
    role: SessionParticipantRoleSchema,
    joinedAt: TimestampSchema,
    leftAt: NullableTimestampSchema
});

export const JoinSessionInputSchema = SessionParticipantSchema.pick({
    sessionId:true,
    userId: true
});

export const LeaveSessionInputSchema = SessionParticipantSchema.pick({
  sessionId: true,
  userId: true,
});


// ---type---

export type SessionParticipant = z.infer<typeof SessionParticipantSchema>
export type JoinSessionInput = z.infer<typeof JoinSessionInputSchema>
export type LeaveSessionInput = z.infer<typeof LeaveSessionInputSchema>