const fs = require('fs');
const path = require('path');

async function generateReport(session) {
    const reportContent = `
        Session Report: ${session.title}
        Mentor: ${session.mentor}
        Date: ${session.date}
        Duration: ${session.duration} minutes
        Participants: ${session.participants.length}
        Feedback: ${session.feedback || 'No feedback collected'}
    `;

    const filePath = path.join(__dirname, `../../reports/${session._id}.txt`);
    fs.writeFileSync(filePath, reportContent);
    console.log(`📄 Report generated for session: ${session.title}`);
}

module.exports = { generateReport };
