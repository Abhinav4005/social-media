/**
 * Admin Authorization Middleware.
 * Protects administrative dashboards (e.g. Bull Board queues) against unauthenticated access.
 */
const adminAuth = (req, res, next) => {
    const adminSecret = process.env.ADMIN_SECRET;
    const providedKey = req.headers["x-admin-key"] || req.query.token;

    if (adminSecret) {
        if (!providedKey || providedKey !== adminSecret) {
            return res.status(401).json({ error: "Unauthorized access to admin resource" });
        }
    } else if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "ADMIN_SECRET configuration missing in production" });
    }

    next();
};

export default adminAuth;
