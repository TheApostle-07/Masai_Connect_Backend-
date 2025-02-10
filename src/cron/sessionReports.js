const cron = require('node-cron');
const Session = require('../models/Sessions');
const { generateReport } = require('../utils/generateReports');

cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
    console.log('Generating session reports...');
    const completedSessions = await Session.find({ status: 'COMPLETED' });

    for (let session of completedSessions) {
        await generateReport(session);
    }
});
