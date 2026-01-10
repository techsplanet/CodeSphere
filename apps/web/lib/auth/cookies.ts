// This is to define cookies configuration
//  to protect against:- CSRF & XSS.


export const sessionCookieConfig = {
    name:"codesphere_session",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24*60*60
}