import {z} from "zod";

export enum Verdict {
    Accepted = "accepted",
    Wrong = "wrong",
    Tle = "tle",
    Error = "error"
}

export const VerdictSchema = z.enum(["accepted","wrong","tle","error"]);

export type verdictType = z.infer<typeof VerdictSchema>