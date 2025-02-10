const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { checkUserStatus, checkPermissions } = require('../middleware/checkUserStatus');
const { permissions } = require('../models/user.model');

// Create a new session
router.post('/', checkUserStatus, checkPermissions(permissions.CREATE_MEETING), sessionController.createSession);
// Fetch all sessions (Admin view)
router.get('/all', checkUserStatus, sessionController.getAllSessions);

// Fetch upcoming sessions for a specific mentor or user
router.get('/user/:userId', sessionController.getUserSessions);

// Update session details
router.put('/:id', sessionController.updateSession);

// Delete a session
router.delete('/:id', sessionController.deleteSession);

// // Send reminders for upcoming sessions
// router.post('/reminders', sessionController.sendSessionReminders);

module.exports = router;
