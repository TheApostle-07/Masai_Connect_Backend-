const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function verifyToken(req, res, next) {
    // Allow public routes without token verification
    const publicRoutes = ['/signup', '/signin', '/api/auth/google/callback'];
    if (publicRoutes.some(route => req.path.includes(route))) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. Token is required.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        console.log('Authorization Header:', req.headers.authorization);
        console.log('Extracted Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        const user = await User.findOne({ user_id: decoded.user_id });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

function checkPermissions(permission) {
    return (req, res, next) => {
        if (!req.user.permissions || !req.user.permissions.includes(permission)) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        next();
    };
}

module.exports = {
    verifyToken,
    checkPermissions,
};
