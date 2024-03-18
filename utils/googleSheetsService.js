const { google } = require("googleapis");

exports.writeToGoogleSheets = async function (records) {
  // Authenticate with your credentials
  const auth = new google.auth.GoogleAuth({
    keyFile: "website-tracker-app-1b96223482da.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // Prepare the data to be written
  const data = records.map((record) => [record.url, ...record.records]);

  // Write the data to the Google Sheet
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: "1ZQ1BrY_xqKSF79Mq7tNHmYuHMecmUVYBaDYau_sR54o",
    range: "WebsiteTracker!A1", // Update this range according to your needs
    valueInputOption: "RAW",
    resource: {
      values: data,
    },
  });

  console.log(response);
};
