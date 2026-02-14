import { AuthorizationDenyReason } from "../../shared-types";

export class AuthorizationError extends Error {
    public readonly reason : AuthorizationDenyReason;

    constructor(reason: AuthorizationDenyReason){
        super(`Authorization failed: ${reason}`)
        this.name = "AuthorizationError";
        this.reason = reason;
    }
}