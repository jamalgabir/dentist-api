// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

require('dotenv').config();

const protectAdminRoute = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1]
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
     
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded.adminId; // Attach the admin ID to the request
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
module.exports = protectAdminRoute