const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (to, subject, text, html) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER,
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
