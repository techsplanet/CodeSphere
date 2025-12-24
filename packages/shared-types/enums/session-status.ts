import {z} from "zod";

export enum SessionStatus {
    Scheduled = "scheduled",
    Live = "live",
    Completed = "completed"
}

export const SessionStatusSchema = z.enum(["scheduled", "live", "completed"]);


export type SessionStatusType = z.infer<typeof SessionStatusSchema>