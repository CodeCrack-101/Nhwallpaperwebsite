/**
 * SMS Gateway Service File
 * Location: backend/services/smsService.js
 * Description: Interfaces with Twilio or Fast2SMS.
 *              Strictly enforces the cheap DLT transactional route (₹0.25 rate)
 *              and blocks the premium Quick route (₹5.00 rate) to prevent high billing.
 */

/**
 * Sends OTP code to the user's real mobile number
 * @param {string} phone - The 10-digit mobile number
 * @param {string} otp - The plain text 6-digit OTP code
 * @returns {Promise<object>} { success: boolean, message: string }
 */
const sendSMS = async (phone, otp) => {
  const message = `Your WALLART verification code is ${otp}. Valid for 5 minutes.`;

  // 1. Try Twilio Configuration first
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioToken && twilioPhone) {
    try {
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = `+91${formattedPhone}`;
      }

      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const authHeader = "Basic " + Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

      const response = await fetch(twilioUrl, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          To: formattedPhone,
          From: twilioPhone,
          Body: message
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`[SMS SERVICE] Twilio successfully dispatched SMS to user`);
        return { success: true, message: "OTP sent successfully via Twilio" };
      } else {
        console.error("[SMS SERVICE] Twilio API error:", data.message || data);
        return { success: false, error: `Twilio gateway error: ${data.message || "Failed to dispatch"}` };
      }
    } catch (error) {
      console.error("[SMS SERVICE] Twilio dispatch exception:", error.message);
      return { success: false, error: `Twilio dispatch failed: ${error.message}` };
    }
  }

  // 2. Try Fast2SMS Configuration second
  const fast2smsKey = process.env.FAST2SMS_API_KEY;

  if (fast2smsKey) {
    try {
      // Fast2SMS expects 10-digit number without +91
      let cleanPhone = phone.trim();
      if (cleanPhone.startsWith("+91")) {
        cleanPhone = cleanPhone.replace("+91", "");
      } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
        cleanPhone = cleanPhone.substring(2);
      }

      const dltSenderId = process.env.FAST2SMS_SENDER_ID;
      const dltTemplateId = process.env.FAST2SMS_TEMPLATE_ID;

      // STRICT CHECK: Verify DLT Sender ID and Template ID are set and are not the placeholders
      const isDltConfigured = dltSenderId && 
                              dltTemplateId && 
                              dltSenderId !== 'YOUR_6_LETTER_SENDER_ID' && 
                              dltTemplateId !== 'YOUR_DLT_TEMPLATE_ID';

      if (!isDltConfigured) {
        console.error(`[SMS SERVICE OVERFLOW PREVENTED] Blocked SMS dispatch: DLT parameters not set.`);
        return {
          success: false,
          error: "SMS dispatch blocked: To prevent ₹5 charges, you must enter your actual approved FAST2SMS_SENDER_ID and FAST2SMS_TEMPLATE_ID in your backend .env file."
        };
      }

      // STRICTLY USE DLT TRANSACTIONAL ROUTE (₹0.25 per SMS)
      const payload = {
        route: "dlt",
        sender_id: dltSenderId.trim(),
        message: dltTemplateId.trim(),
        variables_values: otp.trim(), // Injects the OTP into DLT template variables
        numbers: cleanPhone
      };

      console.log(`[SMS SERVICE] Dispatching via Fast2SMS DLT route (₹0.25 rate)...`);

      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": fast2smsKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data && data.return === true) {
        console.log(`[SMS SERVICE] Fast2SMS successfully dispatched DLT SMS to user`);
        return { success: true, message: "OTP sent successfully via Fast2SMS DLT" };
      } else {
        console.error("[SMS SERVICE] Fast2SMS DLT API error:", data.message || data);
        return { success: false, error: `Fast2SMS DLT gateway error: ${data?.message || "Failed to dispatch"}` };
      }
    } catch (error) {
      console.error("[SMS SERVICE] Fast2SMS dispatch exception:", error.message);
      return { success: false, error: `Fast2SMS dispatch failed: ${error.message}` };
    }
  }

  // 3. Neither gateway is configured
  console.error("[SMS SERVICE] No SMS API keys configured in environment variables!");
  return {
    success: false,
    error: "SMS service is offline. Please configure TWILIO or FAST2SMS keys in your server environment."
  };
};

module.exports = {
  sendSMS
};
