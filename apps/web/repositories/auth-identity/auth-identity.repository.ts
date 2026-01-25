import {CreateAuthIdentityInput, 
        AuthRepositoryIdentity, 
        ResolveAuthIdentityInput,
        ResolveAuthIdentityByAuthUserIdInput, 
        AuthIdentityResolution
    } from "./auth-identity.types"

export interface AuthIdentityRepository{
    createAuthIdentity(input:CreateAuthIdentityInput):Promise<AuthRepositoryIdentity>;
    resolveAuthIdentity(input:ResolveAuthIdentityInput):Promise<AuthIdentityResolution>;
    resolveAuthIdentityByAuthUserId(input: ResolveAuthIdentityByAuthUserIdInput): Promise<AuthIdentityResolution>;
    disableAuthIdentity(input:ResolveAuthIdentityInput):Promise<void>;
}