import {z} from "zod";



export const ProgressContextSchema  = z.enum(["global", "team", "sheet"]);


export type ProgressContext = z.infer<typeof ProgressContextSchema >