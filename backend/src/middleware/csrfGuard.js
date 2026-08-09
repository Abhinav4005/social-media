export const csrfGuard = (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return next();
    }

    const customHeader = req.headers["x-requested-with"];
    const origin = req.headers.origin || req.headers.referer;

    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        process.env.FRONTEND_URL,
        process.env.FRONTEND_BASE_URL,
    ].filter(Boolean);

    if (customHeader === "XMLHttpRequest" || customHeader === "axios") {
        return next();
    }
    if (origin) {
        const matchesOrigin = allowedOrigins.some((allowed) => origin.startsWith(allowed));
        if (matchesOrigin) {
            return next();
        }
    }

    return res.status(403).json({ error: "CSRF security check failed: request rejected" });
};
