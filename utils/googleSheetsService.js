const { google } = require("googleapis");
require("dotenv").config();

exports.writeToGoogleSheets = async function (historyRecords) {
  // Define the titles for your cells
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

  // Transform your records into an array of arrays and prepend the titles
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

  exports.writeToSheet = async function (values) {
    // Authenticate with your credentials

    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.SPREADSHEET_KEYFILE_NAME,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth }); // Creates a Sheets API client instance.
    const spreadsheetId = process.env.SPREADSHEET_ID; // The ID of the spreadsheet.
    const range = process.env.SPREADSHEET_RANGE; // The range in the sheet where data will be written.
    const valueInputOption = "USER_ENTERED"; // How input data should be interpreted.

    const resource = { values }; // The data to be written.

    try {
      const res = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      return res; // Returns the response from the Sheets API.
    } catch (error) {
      console.error("error", error); // Logs errors.
    }
  };

  (async () => {
    const writer = await exports.writeToSheet(values);
    console.log(writer); // Logs the write operation's response.
  })();
};
