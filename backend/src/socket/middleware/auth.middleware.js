import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../../middleware/authenticateToken.js";

function parseCookieHeader(cookieHeader, name) {
    if (!cookieHeader) return null;
    const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Socket.IO auth middleware.
 * Reads the JWT from:
 *   1. HttpOnly cookie in the HTTP upgrade request headers (preferred — XSS-safe)
 *   2. socket.handshake.auth.token (legacy fallback — removed once all clients use cookies)
 */
const socketAuthMiddleware = (socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers?.cookie;
        const cookieToken = parseCookieHeader(cookieHeader, AUTH_COOKIE_NAME);


        const authToken = socket.handshake?.auth?.token;

        const token = cookieToken || authToken;

        if (!token) {
            return next(new Error("Authentication error: missing token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch {
        next(new Error("Authentication error: invalid token"));
    }
};

export default socketAuthMiddleware;