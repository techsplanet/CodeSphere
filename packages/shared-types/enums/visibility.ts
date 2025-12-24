import {z} from "zod";

export enum TeamVisibility {
    Private = "private",
    Public = "public",
}

export const TeamVisibilitySchema = z.enum(["private","public"]);

export enum SheetVisibility {
    Private = "private",
    Public = "public",
    Team = "team"
}

export const SheetVisibilitySchema = z.enum(["public","private","team"]);


export type TeamVisibilityType = z.infer<typeof TeamVisibilitySchema>
export type SheetVisibilityType = z.infer<typeof SheetVisibilitySchema>