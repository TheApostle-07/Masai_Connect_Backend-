// controllers/session.controller.js
const cron = require('node-cron');
const Session = require('../models/Sessions');
const nodemailer = require('nodemailer');
require('dotenv').config();
const mongoose = require('mongoose');

// Create a new session
exports.createSession = async (req, res) => {
    try {
        if (!req.body.title || !req.body.mentor || !req.body.date || !req.body.duration || !req.body.platform) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        const session = new Session(req.body);
        await session.save();
        res.status(201).json({ message: 'Session created successfully', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all sessions (Admin view)
exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().populate('mentor participants.user');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch upcoming sessions for a specific mentor or user
exports.getUserSessions = async (req, res) => {
    try {
        const { userId } = req.params;
        const sessions = await Session.find({
            $or: [
                { mentor: userId },
                { 'participants.user': userId }
            ]
        }).populate('mentor participants.user');
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update session details
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id);
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        if (session.status !== 'SCHEDULED') {
            return res.status(400).json({ message: 'Session cannot be edited in its current status' });
        }
        
        Object.assign(session, req.body);
        await session.save();
        res.status(200).json({ message: 'Session updated successfully', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a session
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findById(id);
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        await session.deleteOne();
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// // Function to send reminders
// const sendReminders = async () => {
//     console.log('Running session reminder job...');
//     const now = new Date();

//     try {
//         const sessions = await Session.find({
//             'reminders.sent': false,
//             'reminders.time': { $lte: now }
//         });

//         console.log(`Found ${sessions.length} sessions with pending reminders.`);

//         for (const session of sessions) {
//             if (!session.startTime) {
//                 console.warn(`Skipping session ${session._id} due to missing startTime`);
//                 continue;
//             }

//             // Collect recipient emails (userEmail + participants)
//             let recipients = [];
//             if (session.userEmail) recipients.push(session.userEmail);
//             if (session.participants && session.participants.length > 0) {
//                 recipients.push(...session.participants.map(p => p.email).filter(email => email));
//             }

//             for (const email of recipients) {
//                 const mailOptions = {
//                     from: process.env.EMAIL_USER,
//                     to: email,
//                     subject: 'Session Reminder',
//                     text: `Hello, this is a reminder for your session scheduled at ${session.startTime}.`
//                 };

//                 await transporter.sendMail(mailOptions);
//                 console.log(`Reminder sent to ${email}`);
//             }

//             // Mark reminders as sent
//             session.reminders.forEach(reminder => (reminder.sent = true));
//             await session.save();
//         }

//     } catch (error) {
//         console.error('Error sending session reminders:', error);
//     }
// };

// // Route to trigger reminders manually
// exports.sendSessionReminders = async (req, res) => {
//     try {
//         await sendReminders();
//         res.status(200).json({ message: 'Reminders sent successfully' });
//     } catch (error) {
//         console.error('Error sending reminder:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// Cron job to run every minute
// cron.schedule('* * * * *', sendReminders);
