import {CreateAuthIdentityInput, AuthRepositoryIdentity, ResolveAuthIdentityInput, AuthIdentityResolution} from "./auth-identity.types"

export interface AuthIdentityRepository{
    createAuthIdentity(input:CreateAuthIdentityInput):Promise<AuthRepositoryIdentity>;
    resolveAuthIdentity(input:ResolveAuthIdentityInput):Promise<AuthIdentityResolution>;
    disableAuthIdentity(input:ResolveAuthIdentityInput):Promise<void>;
}