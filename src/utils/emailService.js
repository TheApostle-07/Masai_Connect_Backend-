require('dotenv').config();
const nodemailer = require('nodemailer');

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email from environment variables
    pass: process.env.EMAIL_PASSWORD, // Your email password (use app passwords for security)
  },
});

/**
 * Sends an email reminder for an upcoming session.
 * @param {string} email - Recipient's email address.
 * @param {string} sessionTitle - The title of the session.
 * @param {Date} startTime - The start time of the session.
 * @param {string} meetingLink - The meeting link for the session.
 */
const sendReminderEmail = async (email, sessionTitle, startTime, meetingLink) => {
  const mailOptions = {
    from: `"Masai Connect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reminder: ${sessionTitle} Session`,
    html: `
      <h2>📢 Session Reminder</h2>
      <p>Dear participant,</p>
      <p>Your session <strong>${sessionTitle}</strong> is scheduled to start at <strong>${new Date(startTime).toLocaleString()}</strong>.</p>
      <p>📌 <a href="${meetingLink}" style="color: blue; font-weight: bold;">Join Session Here</a></p>
      <p>Looking forward to your participation!</p>
      <hr>
      <p><small>This is an automated reminder. Please do not reply to this email.</small></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder sent successfully to ${email}`);
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error);
  }
};

// Export the function for use in other files
module.exports = sendReminderEmail;
