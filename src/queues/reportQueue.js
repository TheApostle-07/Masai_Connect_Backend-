require('dotenv').config();
const Queue = require('bull');
const mongoose = require('mongoose');
const Session = require('../models/Sessions'); // Replace with actual path
const sendEmail = require('../utils/sendEmail');
const redisClient = require('./redisClient'); // Import Redis connection

const reportQueue = new Queue('sessionReports', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

reportQueue.process(async (job, done) => {
    const { sessionId } = job.data;

    try {
        const session = await Session.findById(sessionId).populate('participants.user');

        if (!session) {
            throw new Error('Session not found');
        }

        console.log(`📩 Sending feedback request for session: "${session.title}"`);

        for (const participant of session.participants) {
            await sendEmail({
                to: participant.email,
                subject: `Feedback Request: ${session.title}`,
                text: `Hi, please provide feedback for the session "${session.title}".`,
            });
        }

        console.log(`✅ Feedback request sent for session "${session.title}"`);
        done();
    } catch (error) {
        console.error('❌ Error processing feedback request:', error);
        done(error);
    }
});

// Function to queue a feedback request
reportQueue.addFeedbackRequest = function (session) {
    reportQueue.add({ sessionId: session._id }, { attempts: 3, backoff: 5000 });
};

module.exports = reportQueue;
