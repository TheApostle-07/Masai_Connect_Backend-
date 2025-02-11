const Session = require('../models/Sessions');
const sendEmail = require('../utils/sendEmail');

async function updateSessionStatus() {
    const now = new Date();

    // Find all "SCHEDULED" sessions that should be marked as "COMPLETED"
    const sessionsToUpdate = await Session.find({
        status: "SCHEDULED",
        startTime: { $lte: now }, // Session started
    });

    for (let session of sessionsToUpdate) {
        const sessionEndTime = new Date(session.startTime.getTime() + session.duration * 60000);

        if (now >= sessionEndTime) {
            // Update status to COMPLETED
            session.status = "COMPLETED";
            await session.save();
            console.log(`✅ Updated session "${session.title}" to COMPLETED`);

            // Send feedback email immediately after completion
            if (!session.feedbackSent) {
                for (let participant of session.participants) {
                    if (participant.email) {
                        await sendEmail({
                            to: participant.email,
                            subject: `Feedback for ${session.title}`,
                            text: `Hello, thank you for attending "${session.title}". Please provide your feedback here: [Feedback Link]`
                        });
                    }
                }
                console.log(`📨 Feedback emails sent for session: ${session.title}`);

                // Mark feedback as sent
                session.feedbackSent = true;
                await session.save();
            }
        }
    }
}

// Check every minute to update session status
setInterval(updateSessionStatus, 60 * 1000);
