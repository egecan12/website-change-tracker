const { google } = require("googleapis");
require("dotenv").config();

exports.startWriting = async function (values) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.SPREADSHEET_KEYFILE_NAME,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = process.env.SPREADSHEET_RANGE;
  const valueInputOption = "USER_ENTERED";
  const resource = { values };

  try {
    const res = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    return res;
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

exports.writeToGoogleSheets = async function (historyRecords) {
  const titles = [
    "URL",
    "Content Changed",
    "Previous Status",
    "Recent Status",
    "Previous Response Time",
    "Recent Response Time",
    "Previous Response Message",
    "Recent Response Message",
    "Created At",
  ];

  const values = [
    titles,
    ...historyRecords.flatMap((historyRecord) =>
      historyRecord.records.map((record) => [
        historyRecord.url,
        record.contentHasChanged,
        record.previousResponseStatus,
        record.recentResponseStatus,
        record.previousResponseTime,
        record.recentResponseTime,
        record.previousResponseStatusText,
        record.recentResponseStatusText,
        record.createdAt,
      ])
    ),
  ];

  return exports.startWriting(values);
};
