/**
 * Email Gateway Service File
 * Location: backend/services/emailService.js
 * Description: Interfaces with SMTP server using Nodemailer to send verification
 *              and password reset OTP codes via Email.
 *              Uses Gmail service SMTP from EMAIL_USER and EMAIL_PASS environment variables.
 */

const nodemailer = require('nodemailer');

// Initialize SMTP transporter using Gmail service
const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }
  return null;
};

/**
 * Sends a transactional email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} text - Plain text body content
 * @returns {Promise<boolean>} success status
 */
const sendMail = async (to, subject, text) => {
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"WALLART Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
      });
      console.log(`[EMAIL SERVICE] Email dispatched successfully. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EMAIL SERVICE ERROR] SMTP dispatch exception:`, error.message);
      return false;
    }
  } else {
    // Local development terminal fallback
    console.log("\n------------------- NODEMAILER LOCAL FALLBACK -------------------");
    console.log(`Date:    ${new Date().toLocaleString()}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("Body:");
    console.log(text);
    console.log("-----------------------------------------------------------------\n");
    return true;
  }
};

/**
 * Sends an email OTP code to complete account activation
 * @param {string} email
 * @param {string} name
 * @param {string} otp
 */
const sendOtpEmail = async (email, name, otp) => {
  const subject = "Verify Your Email";
  const text = `Hello ${name},\n\nYour verification code is:\n\n${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not register, please ignore this email.`;
  return await sendMail(email, subject, text);
};

/**
 * Sends a password reset OTP code valid for 10 minutes
 * @param {string} email
 * @param {string} name
 * @param {string} otp
 */
const sendResetOtpEmail = async (email, name, otp) => {
  const subject = "Reset Your Password";
  const text = `Hello ${name},\n\nYour password reset verification code is:\n\n${otp}\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`;
  return await sendMail(email, subject, text);
};

module.exports = {
  sendOtpEmail,
  sendResetOtpEmail
};
