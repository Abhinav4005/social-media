const idempotencyCache = new Map();

setInterval(() => {
    const now = Date.now();
    for (const [key, item] of idempotencyCache.entries()) {
        if (now > item.expiresAt) {
            idempotencyCache.delete(key);
        }
    }
}, 15 * 60 * 1000);

export const idempotencyGuard = (ttlSeconds = 300) => {
    return (req, res, next) => {
        // Only apply to state-mutating methods
        if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            return next();
        }

        const idempotencyKey = req.headers["idempotency-key"] || req.headers["x-idempotency-key"];
        if (!idempotencyKey) {
            return next();
        }

        const cached = idempotencyCache.get(idempotencyKey);
        if (cached) {
            if (Date.now() < cached.expiresAt) {
                return res.status(cached.status).json(cached.body);
            }
            idempotencyCache.delete(idempotencyKey);
        }

        // Intercept response json to cache payload
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                idempotencyCache.set(idempotencyKey, {
                    status: res.statusCode,
                    body,
                    expiresAt: Date.now() + ttlSeconds * 1000
                });
            }
            return originalJson(body);
        };

        next();
    };
};
