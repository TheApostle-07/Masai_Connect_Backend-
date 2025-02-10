const cron = require('node-cron');
const Session = require('../models/Sessions');

cron.schedule('* * * * *', async () => {
    console.log('Enabling join button for sessions starting in 5 minutes...');
    const now = new Date();
    const joinThreshold = new Date(now.getTime() + 5 * 60000); // 5 min ahead

    await Session.updateMany(
        { status: 'SCHEDULED', startTime: { $lte: joinThreshold } },
        { $set: { canJoin: true } }
    );
});
