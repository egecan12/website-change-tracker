const { sendEmail } = require("./emailSender");

exports.sendContentChangedEmail = async (to, url) => {
  const subject = `Content Changed in ${url}`;
  const text = `Hi there, the content you are tracking has changed.`;
  const html = `<p>Hello! Just a friendly reminder that there have been some updates to the content you're keeping an eye on. You can check out the changes at ${url}.</p>`;

  await sendEmail(to, subject, text, html);
};
