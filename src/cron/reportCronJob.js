require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Session = require('../models/Sessions'); // Replace with actual path
const reportQueue = require('./reportQueue');
const redisClient = require('./redisClient'); // Ensure Redis is available

// Connect to MongoDB (update your DB URL)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

cron.schedule('* * * * *', async () => {
    console.log('⏳ Checking for completed sessions...');

    const now = new Date();

    try {
        const sessions = await Session.find({
            status: 'SCHEDULED',
            startTime: { $lte: now },
        });

        sessions.forEach(async (session) => {
            const endTime = new Date(session.startTime);
            endTime.setMinutes(endTime.getMinutes() + session.duration);

            if (now >= endTime) {
                session.status = 'COMPLETED';
                await session.save();
                console.log(`✅ Session "${session.title}" marked as COMPLETED.`);

                // Queue feedback request
                reportQueue.addFeedbackRequest(session);
            }
        });
    } catch (error) {
        console.error('❌ Error checking sessions:', error);
    }
});
