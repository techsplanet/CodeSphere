import {z} from "zod";


export const SessionStatusSchema = z.enum(["scheduled", "live", "completed"]);


export type SessionStatus = z.infer<typeof SessionStatusSchema>