import { AuthorizationRequest } from "../../shared-types";
import { evaluateAuthorization } from "./evaluate-authorization";
import { AuthorizationError } from "./authorization-error";

export function requirePermission( request: AuthorizationRequest): void {
    const decision = evaluateAuthorization(request);

    if (!decision.allowed){
        throw new AuthorizationError(decision.reason)
    }
}