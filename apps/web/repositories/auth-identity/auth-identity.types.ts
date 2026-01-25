import  {AuthProvidersType, AuthIdentity, UserId} from "../../../../packages/shared-types"

export type AuthRepositoryIdentity = AuthIdentity;
export type AuthRepositoryProvider = AuthProvidersType;
export type AuthRepositoryUserId = UserId;
export type CreateAuthIdentityInput = {
    authUserId: AuthUserId;
    provider: AuthProvidersType,
    providerUserId: string,
    email: string,
    emailVerified: boolean,
    userId: UserId
};
export type ResolveAuthIdentityInput = {
    provider: AuthProvidersType,
    providerUserId: string
}


export type AuthIdentityResolution =
  | { status: "active"; identity: AuthRepositoryIdentity }
  | { status: "disabled" }
  | { status: "not_found" };


export type AuthUserId = string;

export type ResolveAuthIdentityByAuthUserIdInput = {
    authUserId: AuthUserId;
}