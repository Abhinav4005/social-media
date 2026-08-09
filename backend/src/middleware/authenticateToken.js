import jwt from "jsonwebtoken";

const IS_PROD = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_NAME = "token";

/**
 * Standard HttpOnly cookie options.
 * - httpOnly  → JS cannot access the cookie (mitigates XSS token theft)
 * - secure    → HTTPS-only in production
 * - sameSite  → "Strict" blocks CSRF cross-site requests
 * - maxAge    → 7 days in milliseconds
 */
export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "Strict" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
};

/**
 * authenticateToken middleware
 * Reads the JWT from:
 *   1. req.cookies.token  (HttpOnly cookie — preferred, XSS-safe)
 *   2. Authorization: Bearer <token> header (fallback for API clients)
 */
const authenticateToken = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];

        const authHeader = req.headers["authorization"];
        const headerToken = authHeader && authHeader.split(" ")[1];

        const token = cookieToken || headerToken;

        if (!token) {
            return res.status(401).json({ error: "Access token is missing" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Invalid access token" });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error("Error authenticating token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default authenticateToken;