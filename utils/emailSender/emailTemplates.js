const { sendEmail } = require("./emailSender");

exports.sendContentChangedEmail = async (to, url) => {
  const spreadsheetId = process.env.SPREADSHEET_ID;

  // Generate the Google Sheets URL
  const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`;
  // Generate the Email
  const subject = `Content Changed in ${url}`;
  const text = `Hi there, the content you are tracking on ${url}, has changed !`;
  const html = `<p>Hello! Just a friendly reminder that there have been some updates on ${url}. You can check out the changes at ${googleSheetsUrl}.</p>`;

  await sendEmail(to, subject, text, html);
};
