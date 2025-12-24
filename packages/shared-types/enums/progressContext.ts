import {z} from "zod";

export enum ProgressContext {
       Global = "global",
       Team = "team",
       Sheet = "sheet"
}

export const ProgressContextSchema  = z.enum(["global", "team", "sheet"]);


export type ProgressContextType = z.infer<typeof ProgressContextSchema >