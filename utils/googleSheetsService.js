const { google } = require("googleapis");

exports.writeToGoogleSheets = async function (historyRecords) {
  //   const mockRecords = [
  //     {
  //       url: "kahyaogluegecan.tech/sample-page",
  //       records: [
  //         {
  //           _id: "65f75a416744e27a61ddf8b1",
  //           url: "kahyaogluegecan.tech/sample-page",
  //           contentHasChanged: false,
  //           previousResponseStatus: 200,
  //           recentResponseStatus: 200,
  //           previousResponseTime: 1661,
  //           recentResponseTime: 1521,
  //           createdAt: "2024-03-17T21:01:53.721Z",
  //           __v: 0,
  //         },
  //         {
  //           _id: "65f76708cfab854be0273062",
  //           url: "kahyaogluegecan.tech/sample-page",
  //           contentHasChanged: false,
  //           previousResponseStatus: 200,
  //           recentResponseStatus: 200,
  //           previousResponseTime: 1661,
  //           recentResponseTime: 1648,
  //           createdAt: "2024-03-17T21:56:24.836Z",
  //           __v: 0,
  //         },
  //         {
  //           _id: "65f77b69d42fb7fdd272c389",
  //           url: "kahyaogluegecan.tech/sample-page",
  //           contentHasChanged: false,
  //           previousResponseStatus: 200,
  //           recentResponseStatus: 200,
  //           previousResponseTime: 1661,
  //           recentResponseTime: 2432,
  //           createdAt: "2024-03-17T23:23:21.566Z",
  //           __v: 0,
  //         },
  //       ],
  //     },
  //     {
  //       url: "https://www.guvenlicocuk.org.tr/meslekler/avukat",
  //       records: [
  //         {
  //           _id: "65f75a426744e27a61ddf8b4",
  //           url: "guvenlicocuk.org.tr/meslekler/avukat",
  //           contentHasChanged: true,
  //           previousResponseStatus: 200,
  //           recentResponseStatus: 200,
  //           previousResponseTime: 316,
  //           recentResponseTime: 205,
  //           createdAt: "2024-03-17T21:01:54.733Z",
  //           __v: 0,
  //         },
  //         {
  //           _id: "65f76709cfab854be0273065",
  //           url: "guvenlicocuk.org.tr/meslekler/avukat",
  //           contentHasChanged: true,
  //           previousResponseStatus: 200,
  //           recentResponseStatus: 200,
  //           previousResponseTime: 316,
  //           recentResponseTime: 230,
  //           createdAt: "2024-03-17T21:56:25.616Z",
  //           __v: 0,
  //         },
  //       ],
  //     },
  //   ];

  // Define the titles for your cells
  const titles = [
    "URL",
    "Content Changed",
    "Previous Status",
    "Recent Status",
    "Previous Response Time",
    "Recent Response Time",
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
        record.createdAt,
      ])
    ),
  ];

  exports.writeToSheet = async function (values) {
    // Authenticate with your credentials

    const auth = new google.auth.GoogleAuth({
      keyFile: "website-tracker-app-1b96223482da.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
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
