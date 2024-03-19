# Website Monitoring API

This is an API that monitors specific changes on a webpage. It's built with Node.js and Express, and uses MongoDB for the database.

## Project Diagram

![diagram](https://github.com/egecan12/website-change-tracker/assets/45043515/70c66fc4-b53d-4d72-998e-7fd01eb11515)

## Features

- Monitor specific changes on a webpage
- Send notifications via email and SMS when changes are detected
- Show records on a spreadsheet

## Prerequisites

- Node.js
- npm
- MongoDB
- SendGrid account
- Twilio account
- Google Sheets API credentials

## Installation

1. Clone the repository:

```sh
git clone https://github.com/egecan12/website-change-tracker.git

cd website-monitoring-app
npm install

npm start
```

Important Notes:
Create a .env file in the root directory of the project, and add your environment variables:

```sh
DB_URI=your_mongodb_uri
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=your_sendgrid_sender_email
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SPREADSHEETID=your_id
SPREADSHEET_KEYFILE_NAME=your_keyfile_name
SPREADSHEET_RANGE=Sheet1!A1
```

To be able to run the app, you must set url links, sending a post request to

```sh
"http://localhost:8000/targetlink/add"
example req.body = {
"urls": ["youexampleweblink.com/","www.kahyaogluegecan.tech", "https://translate.google.com/", "https://www.makeuseof.com/using-galaxy-watch-with-iphone/" ]
}
```

Please do not forget including googlesheets credentials keyfile as json file!

## Development Notes

1)When I compare the contents of websites, I notice that most websites are using some sort of dynamic variables and attribute names based on the currentDate to protect themselves from XSS attacks. This situation causes the contentHasChanged variable to always return true. In order to minimize this issue, I installed the Cheerio npm package to exclude style and script tags, as well as attribute names. The code now only includes the HTML content within the <body> tags. Please keep in mind that this makes the comparison less strict, so if there are any changes to the design of the website, the code may not detect them since it excludes style tags.

However, you can always revert this by modifying the code in the compare function, removing the htmlSimplifier around the currentContent, as well as the cachedContent on lines 83-84.

Developed by Egecan Kahyaoglu.
