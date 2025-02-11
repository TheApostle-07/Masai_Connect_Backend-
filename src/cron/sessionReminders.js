const cron = require("node-cron");
const Session = require("../models/Sessions");
const { sendEmail } = require("../queues/emailQueue");

cron.schedule("* * * * *", async () => {
  console.log("🕒 Checking for upcoming session reminders...");

  const now = new Date();
  now.setSeconds(0, 0); // Normalize to minute precision

  try {
    const sessions = await Session.find({ status: "SCHEDULED" });
    console.log(`📌 Found ${sessions.length} scheduled sessions.`);

    let remindersSent = 0;

    for (let session of sessions) {
      const sessionStartTime = new Date(session.startTime);
      const reminderTime = new Date(sessionStartTime.getTime() - 10 * 60000); // 10 min before startTime

      // If session is newly scheduled and reminder not sent, send an instant email
      if (!session.reminders || session.reminders.length === 0) {
        console.log(
          `🚀 Instant reminder for newly scheduled session: ${session.title}`
        );

        for (let participant of session.participants) {
          console.log(`📧 Sending instant email to: ${participant.email}`);

          await sendEmail({
            to: participant.email,
            subject: `Session Scheduled: ${session.title}`,
            text: `Your session "${session.title}" has been scheduled for ${session.startTime}. Click here to join: ${session.meetingLink}`,
          });

          console.log(`✅ Instant email sent to: ${participant.email}`);
        }

        // Initialize reminder tracking
        session.reminders = [{ time: reminderTime, sent: false }];
        await session.save();
        console.log(`💾 Instant reminder recorded for: ${session.title}`);
      }

      // Send email exactly at reminder time
      if (reminderTime.getTime() === now.getTime()) {
        console.log(
          `✅ Sending scheduled reminder for session: ${session.title}`
        );

        for (let participant of session.participants) {
          console.log(`📧 Sending email to: ${participant.email}`);
          
          await sendEmail({
            to: participant.email,
            subject: `Reminder: Upcoming Session - ${session.title}`,
            html: `
                        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
                            
                            <!-- Header -->
                            <div style="text-align: center; background-color:rgb(52, 110, 227); padding: 20px; border-radius: 10px;">
                                <img src="https://firstnews.co.in/wp-content/uploads/2023/01/Masai-School_Logo.png" alt="Platform Logo" style="width: 50px;">
                                <h2 style="color: white; margin: 10px 0;">${
                                  session.title
                                }</h2>
                                <p style="color: white;">📢 ${
                                  session.participants.length
                                } Members</p>
                                <a href="UNREAD_MESSAGES_LINK" style="display: inline-block; background-color: white; color:rgb(52, 110, 227); padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                                    🔔 View All Unread Messages
                                </a>
                            </div>
                    
                            <!-- Body -->
                            <div style="background-color: white; padding: 20px; border-radius: 10px; margin-top: 15px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <th style="background-color:rgb(52, 110, 227); color: white; padding: 10px; text-align: left;">Title</th>
                                        <td style="padding: 10px;">${
                                          session.title
                                        }</td>
                                    </tr>
                                    <tr>
                                        <th style="background-color:rgb(52, 110, 227); color: white; padding: 10px; text-align: left;">Description</th>
                                        <td style="padding: 10px;">${
                                          session.description
                                        }</td>
                                    </tr>
                                    <tr>
                                        <th style="background-color:rgb(52, 110, 227); color: white; padding: 10px; text-align: left;">Mentor</th>
                                        <td style="padding: 10px;">${
                                          session.mentor
                                        }</td>
                                    </tr>
                                    <tr>
                                        <th style="background-color:rgb(52, 110, 227); color: white; padding: 10px; text-align: left;">Date & Time</th>
                                        <td style="padding: 10px;">${new Date(
                                          session.startTime
                                        ).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th style="background-color:rgb(52, 110, 227); color: white; padding: 10px; text-align: left;">Platform</th>
                                        <td style="padding: 10px;">${
                                          session.platform
                                        }</td>
                                    </tr>
                                </table>
                    
                                <div style="text-align: center; margin-top: 20px;">
                                    <a href="${
                                      session.meetingLink
                                    }" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                                        📅 Join Session
                                    </a>
                                </div>
                            </div>
                    
                            <!-- Footer -->
<div style="text-align: center; margin-top: 20px; background-color: #f8f9fa; padding: 10px; border-radius: 10px;">
    <img src="https://firstnews.co.in/wp-content/uploads/2023/01/Masai-School_Logo.png" alt="Platform Logo" style="width: 30px;">
    <p style="margin: 5px 0;">Follow us on:</p>

    <!-- YouTube -->
    <a href="https://youtube.com/@masaischool?si=HrUrLEh0b0AkCtrD" target="_blank" style="margin: 0 5px;">
        <img src="https://www.freeiconspng.com/uploads/youtube-logo-in-png-26.png" alt="YouTube" style="width: 25px;">
    </a>

    <!-- Facebook -->
    <a href="https://www.facebook.com/share/17aqbasxcm/" target="_blank" style="margin: 0 5px;">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Facebook_logo_36x36.svg/1200px-Facebook_logo_36x36.svg.png" alt="Facebook" style="width: 25px;">
    </a>

    <!-- LinkedIn -->
    <a href="https://www.linkedin.com/school/masaischool/" target="_blank" style="margin: 0 5px;">
        <img src="https://pngimg.com/uploads/linkedIn/linkedIn_PNG16.png" alt="LinkedIn" style="width: 25px;">
    </a>

    <!-- Instagram -->
    <a href="https://www.instagram.com/masaischool/?hl=en" target="_blank" style="margin: 0 5px;">
        <img src="https://getdrawings.com/vectors/instagram-logo-vector-png-12.png" alt="Instagram" style="width: 25px;">
    </a>

    <p style="color: gray; font-size: 12px;">© 2025 Masai Connect. All rights reserved.</p>
</div>

                    
                        </div>
                        `,
          });

          console.log(`✅ Email sent to: ${participant.email}`);
        }

        // Mark reminder as sent
        session.reminders.forEach((reminder) => {
          if (
            new Date(reminder.time).getTime() === reminderTime.getTime() &&
            !reminder.sent
          ) {
            reminder.sent = true;
            remindersSent++;
          }
        });

        await session.save();
        console.log(`💾 Reminder status updated for: ${session.title}`);
      }
    }

    console.log(`📢 Total reminders sent in this run: ${remindersSent}`);
  } catch (error) {
    console.error("❌ Error processing session reminders:", error);
  }
});
