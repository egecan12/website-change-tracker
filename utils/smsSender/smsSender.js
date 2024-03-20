const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendContentChangedSms = async (to, body) => {
  try {
    if (!to || !body) {
      throw new Error('Invalid parameters: "to" and "body" are required');
    }
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
};
