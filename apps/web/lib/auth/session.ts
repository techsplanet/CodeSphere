// This is to define the Session Contract : what can be asked to auth system.

export type AuthenticatedSession = {
    userId: string;
}

export async function getSession(): Promise<AuthenticatedSession | null> {
    throw new Error("Not implemented");
}

export async function requireSession(): Promise<AuthenticatedSession> {
    throw new Error("Not implemented");
}