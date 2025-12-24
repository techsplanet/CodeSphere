import {z} from "zod";
import { UserIdSchema } from "../core/ids";
import { UserSchema } from "./user";
import { AuthProvidersSchema } from "../enums";

//NOTE:- This is NOT an auth implementation, 
// it's just an minimal contract btw the - Auth layer (Auth.js), Backend, Identity System.



export const AuthIdentitySchema = z.object({
    userId: UserIdSchema,
    provider: AuthProvidersSchema,
    providerUserId: z.string(),
    email: z.email(),
    emailVerified: z.boolean(),
});

export const AuthSessionUserSchema = UserSchema.pick({
    id: true,
    displayName: true,
    avatarUrl: true
});

// inferring types for use in application logic.
export type AuthIdentity = z.infer<typeof AuthIdentitySchema>
export type AuthSessionUser = z.infer<typeof AuthSessionUserSchema>