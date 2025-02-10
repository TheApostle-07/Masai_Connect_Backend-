
// const cron = require('node-cron');
// const Session = require('../models/Sessions');
// const sessionQueue = require('../jobs/sessionQueue');

// // Function to check and add upcoming sessions to queue
// const checkUpcomingSessions = async () => {
//     try {
//         const now = new Date();
//         const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

//         // Find sessions starting in the next 5 minutes
//         const upcomingSessions = await Session.find({
//             status: 'SCHEDULED',
//             startTime: { $gte: now, $lte: fiveMinutesLater },  // ✅ Fixed typo: Changed `date` to `startTime`
//         });

//         if (upcomingSessions.length > 0) {
//             console.log(`Adding ${upcomingSessions.length} sessions to the queue.`);

//             upcomingSessions.forEach(session => {
//                 sessionQueue.add({ uniqueID: session._id });  // ✅ Fixed typo: Changed `uniqueID` to `_id`
//             });
//         }
//     } catch (error) {
//         console.error('Error checking upcoming sessions:', error);
//     }
// };

// // Schedule the cron job to run every minute
// cron.schedule('* * * * *', () => {
//     console.log('Running session queue job...');
//     checkUpcomingSessions();
// });

// module.exports = checkUpcomingSessions;  