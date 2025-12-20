import {z} from "zod";

export const VerdictSchema = z.enum(["accepted","wrong","tle","error"]);

export type verdict = z.infer<typeof VerdictSchema>