const fs = require('fs');
const mongoose = require('mongoose');
const Session = require('../models/Sessions'); // Replace with actual path

async function generateReport(sessionId) {
    try {
        const session = await Session.findById(sessionId).populate('participants.user');

        if (!session) {
            throw new Error('Session not found');
        }

        const reportContent = `
            Session Report: ${session.title}
            Mentor: ${session.mentor}
            Date: ${session.date}
            Duration: ${session.duration} minutes
            Participants: ${session.participants.length}
            Feedback: ${session.feedback || 'No feedback collected'}
        `;

        fs.writeFileSync(`reports/session_${sessionId}.txt`, reportContent);
        console.log(`Report generated for session "${session.title}"`);
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

module.exports = generateReport;
