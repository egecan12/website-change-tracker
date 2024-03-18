const { google } = require("googleapis");

exports.writeToGoogleSheets = async function (records) {
  // Authenticate with your credentials
  const auth = new google.auth.GoogleAuth({
    keyFile: "website-tracker-app-1b96223482da.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const mockRecords = [
    {
      url: "https://example.com",
      records: ["200", "300ms", "No"],
    },
    {
      url: "https://another-example.com",
      records: ["404", "500ms", "Yes"],
    },
    {
      url: "https://yet-another-example.com",
      records: ["500", "600ms", "No"],
    },
  ];

  // Define the titles for your cells
  const titles = ["URL", "Status", "Response Time", "Content Changed"];

  // Transform your records into an array of arrays and prepend the titles
  const values = [
    titles,
    ...mockRecords.map((record) => [record.url, ...record.records]),
  ];

  exports.writeToSheet = async function (values) {
    const sheets = google.sheets({ version: "v4", auth }); // Creates a Sheets API client instance.
    const spreadsheetId = "1ZQ1BrY_xqKSF79Mq7tNHmYuHMecmUVYBaDYau_sR54o"; // The ID of the spreadsheet.
    const range = "Sayfa1!A1"; // The range in the sheet where data will be written.
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
