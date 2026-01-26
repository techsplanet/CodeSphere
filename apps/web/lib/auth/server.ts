import { betterAuth } from "better-auth";
import type { User, Account } from "better-auth/types";
import { nextCookies } from "better-auth/next-js";
import { sessionCookieConfig } from "./cookies";
import { env } from "../env";
import { AuthProviderIdentity, resolveLoginIdentity } from "./identity";

type OAuthProfile = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

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
  secret: env.BETTER_AUTH_SECRET, // Critical security anchor for cryptographic signing, session encryption, and CSRF protection.

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
    onSignIn: async (ctx: { user: User; account: Account; profile?: OAuthProfile }) => {
      const identitySignals: AuthProviderIdentity = {
        authUserId: ctx.user.id,
        provider: assertSupportedProvider(ctx.account.providerId),
        providerUserId: ctx.account.accountId,
        ...(ctx.profile?.email !== undefined && { email: ctx.profile.email }),
        ...(ctx.profile?.name !== undefined && { name: ctx.profile.name }),
        ...(ctx.profile?.image !== undefined && { image: ctx.profile.image }),
      };

      await resolveLoginIdentity(identitySignals);

      return true;
    },
  },
});

// explicit type narowing function -

type SupportedAuthProvider = "google" | "github" | "linkedin";

function assertSupportedProvider(providerId: string): SupportedAuthProvider {
  if (providerId === "google" || providerId === "github" || providerId === "linkedin") {
    return providerId;
  }

  throw new Error(`Unsupported auth provider: ${providerId}`);
}
