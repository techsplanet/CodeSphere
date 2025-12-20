import {z} from "zod";

export const LanguageSchema = z.enum(["cpp", "java", "python", "js"]);

export type language = z.infer<typeof LanguageSchema>