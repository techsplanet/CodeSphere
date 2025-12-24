import {z} from "zod";

export enum Language {
    Cpp ="cpp",
    Java = "java",
    Pyhton = "python",
    Js = "js"
}

export const LanguageSchema = z.enum(["cpp", "java", "python", "js"]);

export type LanguageType = z.infer<typeof LanguageSchema>