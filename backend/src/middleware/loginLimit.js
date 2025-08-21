import rateLimit from 'express-rate-limit';

const loginLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many login attempts, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default loginLimit;