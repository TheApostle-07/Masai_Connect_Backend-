const express = require('express');
const { signup, signin, getProfile, createMeeting } = require('../controllers/authController');
const { verifyToken, checkPermissions } = require('../middleware/auth');
const User = require('../models/user.model');

const router = express.Router();

// Routes
router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', verifyToken, getProfile);
router.post('/create-meeting', verifyToken, checkPermissions([User.permissions.CREATE_MEETING]), createMeeting);

module.exports = router;