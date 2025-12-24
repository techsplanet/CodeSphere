import type {RepositoryUser, RepositoryUserId, RepositoryCreateUserInput, RepositoryAuthProviders } from "./user.types"

export interface UserRepository {
    
    createUser(input: RepositoryCreateUserInput): Promise<RepositoryUser>;

    findUserById(input: RepositoryUserId): Promise<RepositoryUser | null>;

    findUserByAuthId(provider:RepositoryAuthProviders, providerUserId:string): Promise<RepositoryUser | null>;

    deleteUserById(input: RepositoryUserId): Promise<void>;

}