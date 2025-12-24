import {CreateAuthIdentityInput, AuthRepositoryIdentity, ResolveAuthIdentityInput} from "./auth-identity.types"

export interface AuthIdentityRepository{
    createAuthIdentity(input:CreateAuthIdentityInput):Promise<AuthRepositoryIdentity>;
    resolveAuthIdentity(input:ResolveAuthIdentityInput):Promise<AuthRepositoryIdentity | null>;
    disableAuthIdentity(input:ResolveAuthIdentityInput):Promise<void>;
}