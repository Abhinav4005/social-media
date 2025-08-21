import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Access token is missing" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: "Invalid access token" });
            }
            req.user = user;
            next();
        })
    } catch (error) {
        console.error("Error authenticating token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
} 

export default authenticateToken;