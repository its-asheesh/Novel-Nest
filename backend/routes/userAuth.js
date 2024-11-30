const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET || "bookstore123", (err, decoded) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            const message = err.name === "TokenExpiredError"
                ? "Token expired. Please sign in again."
                : "Invalid token.";
            return res.status(403).json({ message });
        }

        req.user = decoded.authClaims; 
        next();
    });
};

module.exports = { authenticateToken };
