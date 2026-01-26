import { getSession } from "./session";
import { authIdentityRepository, userRepository } from "@/repositories";
import { AuthError } from "./error";

type CurrentUser = {
    id: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  
  const session = await getSession();
  if (!session) {
    return null;
  }

  const identityResult =
    await authIdentityRepository.resolveAuthIdentityByAuthUserId({
      authUserId: session.authUserId,
    });

  if (identityResult.status !== "active") {
    return null;
  }

  const user = await userRepository.findUserById(
    identityResult.identity.userId
  );

  if (!user) {
    return null;
  }

  return { id: user.id };
}


export async function requireCurrentUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthError(
      "AUTH_REQUIRED",
      "Authentication required to perform this action"
    );
  }

  return user;
}