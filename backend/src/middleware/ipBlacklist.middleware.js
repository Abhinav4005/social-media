const blacklistedIps = new Set();

export const ipBlacklistGuard = (req, res, next) => {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (clientIp && blacklistedIps.has(clientIp)) {
        return res.status(403).json({
            success: false,
            message: "Access forbidden: Your IP address has been temporarily blocked due to security violations."
        });
    }

    next();
};

export const blockIp = (ip) => {
    if (ip) blacklistedIps.add(ip);
};

export const unblockIp = (ip) => {
    if (ip) blacklistedIps.delete(ip);
};

export const getBlockedIps = () => Array.from(blacklistedIps);
