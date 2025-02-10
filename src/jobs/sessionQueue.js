// const Queue = require('bull');
// const Session = require('../models/Sessions'); // ✅ Fixed import path

// const sessionQueue = new Queue('sessionQueue', {
//     redis: { host: '127.0.0.1', port: 6379 }, // Ensure Redis connection is correct
// });

// sessionQueue.process(async (job, done) => {
//     const { uniqueID } = job.data;
//     console.log(`Activating Join button for Session ID: ${uniqueID}`);

//     try {
//         const updatedSession = await Session.updateOne(
//             { _id: uniqueID }, // ✅ Fixed: Changed `uniqueID` to `_id`
//             { $set: { status: 'ACTIVE' } } // ✅ Ensure status matches your schema's expected values
//         );

//         if (updatedSession.modifiedCount > 0) {
//             console.log(`Session ID: ${uniqueID} is now active.`);
//         } else {
//             console.log(`No session found with ID: ${uniqueID}`);
//         }

//         done(); // Mark job as completed
//     } catch (err) {
//         console.error('Error processing session job:', err);
//         done(err);
//     }
// });

// module.exports = sessionQueue; 