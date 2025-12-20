import {z} from "zod";


export const TeamVisibilitySchema = z.enum(["private","public"]);
export const SheetVisibilitySchema = z.enum(["public","private","team"]);


export type TeamVisibility = z.infer<typeof TeamVisibilitySchema>
export type SheetVisibility = z.infer<typeof SheetVisibilitySchema>