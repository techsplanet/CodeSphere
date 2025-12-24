import {z} from "zod";

export enum AuthProviders  {
    Google = "google",
    Github = "github",
    LinkedIn = "linkedin"
}

export const AuthProvidersSchema = z.enum(["google", "github", "linkedin"]);



//---types---

export type AuthProvidersType = z.infer<typeof AuthProvidersSchema>