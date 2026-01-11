// resolving the login Identity and binding with domain user.
import { userRepository, authIdentityRepository } from "@/repositories";
import { AuthError } from "./error";

type AuthProviderIdentity = {
  provider: "google" | "github" | "linkedin";
  providerUserId: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

type ResolvedIdentity = { userId: string };

export const resolveLoginIdentity = async (
  input: AuthProviderIdentity
): Promise<ResolvedIdentity> => {
  const { provider, providerUserId, email, name, image } = input;
  const result = await authIdentityRepository.resolveAuthIdentity({
    provider,
    providerUserId,
  });

  if (result.status === "active") {
    return { userId: result.identity.userId };
  } else if (result.status === "disabled") {
    throw new AuthError(
      "AUTH_IDENTITY_DISABLED",
      "This account has been disabled and cannot sign in"
    );
  } else {
    const { id } = await userRepository.createUser({
      username: name ?? "user",
      displayName: name ?? "Anonymous",
      avatarUrl: image ?? undefined,
    });

    const identity = await authIdentityRepository.createAuthIdentity({
      provider: provider,
      providerUserId: providerUserId,
      email: email ?? "",
      emailVerified: false,
      userId: id,
    });

    return { userId: identity.userId };
  }
};
