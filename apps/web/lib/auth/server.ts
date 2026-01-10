import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { sessionCookieConfig } from "./cookies";

export const auth = betterAuth({

    session: {
        expiresIn: 60*60*24*7,
        updateAge: 60*60*24,
        freshAge: 60*60,
    },

    cookies: {
        sessionToken: {
            name: sessionCookieConfig.name,
            options: {
                httpOnly: sessionCookieConfig.httpOnly,
                sameSite: sessionCookieConfig.sameSite,
                secure: sessionCookieConfig.secure,
                path: sessionCookieConfig.path
            },
        },
    },

    plugins: [ nextCookies(),]
})