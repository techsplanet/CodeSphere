import { userRepository as mongoUserRepository } from "./user/user.repository.mongo";
import { authIdentityRepository as mongoAuthIdentityRepository } from "./auth-identity/auth-identity.repository.mongo";

export const userRepository = mongoUserRepository;
export const authIdentityRepository = mongoAuthIdentityRepository;
