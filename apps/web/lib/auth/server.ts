import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { sessionCookieConfig } from "./cookies";
import { env } from "../env";
import { AuthProviderIdentity, resolveLoginIdentity } from "./identity";

// Guarded configs enable partial app functionality based on available ENV keys for local dev and CI/CD.
const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }
    : undefined;

const linkedinProvider =
  env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET
    ? {
        clientId: env.LINKEDIN_CLIENT_ID,
        clientSecret: env.LINKEDIN_CLIENT_SECRET,
      }
    : undefined;

export const auth = betterAuth({

    secret: env.BETTER_AUTH_SECRET,  // Critical security anchor for cryptographic signing, session encryption, and CSRF protection.

    socialProviders: {
        ...(googleProvider && { google: googleProvider }),
        ...(linkedinProvider && { linkedin: linkedinProvider }),
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        freshAge: 60 * 60,
    },

    cookies: {
        sessionToken: {
            name: sessionCookieConfig.name,
            options: {
                httpOnly: sessionCookieConfig.httpOnly,
                sameSite: sessionCookieConfig.sameSite,
                secure: sessionCookieConfig.secure,
                path: sessionCookieConfig.path,
            },
        },
    },

    plugins: [nextCookies()],

    callbacks: {
        onSignIn: async (ctx) => {
            const identitySignals: AuthProviderIdentity = {
                provider: ctx.account.provider,
                providerUserId: ctx.account.providerId,
                email: ctx.profile?.email ?? undefined,
                name: ctx.profile?.name ?? undefined,
                image: ctx.profile?.image ?? undefined,
            };

            await resolveLoginIdentity(identitySignals);

            return true;
        },
    },
});
