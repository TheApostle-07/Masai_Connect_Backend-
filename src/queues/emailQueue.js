const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendEmail({ to, subject, text, html }) {
    try {
        console.log(`📨 Preparing to send email to ${to}...`);
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html, // Add HTML support
        });
        console.log(`✅ Email successfully sent to ${to}`);
    } catch (error) {
        console.error(`❌ Email sending failed for ${to}:`, error);
    }
}

module.exports = { sendEmail };