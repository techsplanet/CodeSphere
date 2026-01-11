// “This defines the auth boundary contract: what the rest of the app may ask from the authentication system.”
import { headers } from "next/headers";
import { auth } from "./server";
import { AuthError } from "./error";

export type AuthValidatedSession = {
    sessionId: string;
}

export async function getSession(): Promise<AuthValidatedSession | null> {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session){
        return null
    }
    
    return {sessionId: session.session.id}
}

export async function requireSession(): Promise<AuthValidatedSession> {

    const session = await getSession()

    if (!session){
        throw new AuthError("AUTH_REQUIRED", "log-in required to perform this action");
    }
        
    return session
    
}