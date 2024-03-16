const { sendEmail } = require("./emailSender");

exports.sendContentChangedEmail = async (to) => {
  const subject = "Content Changed";
  const text = "Hi there, the content you are tracking has changed.";
  const html =
    "<p>Hello! Just a friendly reminder that there have been some updates to the content you're keeping an eye on.</p>";

  await sendEmail(to, subject, text, html);
};
