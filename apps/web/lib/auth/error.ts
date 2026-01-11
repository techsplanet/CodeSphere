/**
 * Refined AuthError
 * Inherits 'message' and 'stack' from the native Error class.
 * Adds a predictable 'code' for frontend logic handling.
 */
export class AuthError extends Error {
    readonly code: string;

    constructor(code: string = "UNAUTHORIZED", message: string = "Authentication required") {
        // Pass message to the native Error constructor
        super(message);
        
        // Ensure the name reflects the class for debugging
        this.name = "AuthError";
        
        // Set the explicit, predictable code
        this.code = code;

        // Maintains proper stack trace in V8 (useful for debugging)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthError);
        }
    }
}