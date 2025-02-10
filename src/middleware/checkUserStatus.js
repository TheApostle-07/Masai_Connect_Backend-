const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const checkUserStatus = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. Token is required.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ user_id: decoded.user_id });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Allow users with the required permission to create a meeting even if status is PENDING
        if (user.status === 'PENDING' && !user.permissions.includes('create_meeting')) {
            return res.status(403).json({
                error: 'Account approval pending. Redirecting to the approval page.',
                redirect: '/pending-approval',
            });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error('Error in checkUserStatus middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const checkPermissions = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions.includes(requiredPermission)) {
            return res.status(403).json({ error: 'Forbidden. You do not have permission.' });
        }
        next();
    };
};

module.exports = { checkUserStatus, checkPermissions };
