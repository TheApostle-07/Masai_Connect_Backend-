require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail({ to, subject, text }) {
    try {
        if (!to || to.length === 0) {
            console.error("❌ No recipient email provided.");
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Array.isArray(to) ? to.join(',') : to, // Handle multiple recipients
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📨 Email sent to ${to}: ${info.response}`);
    } catch (error) {
        console.error(`❌ Error sending email:`, error);
    }
}

module.exports = sendEmail;
