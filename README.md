# Website Monitoring API

This is an API that monitors specific changes on a webpage. It's built with Node.js and Express, and uses MongoDB for the database.

## Project Diagram

![diagram](https://github.com/egecan12/website-change-tracker/assets/45043515/70c66fc4-b53d-4d72-998e-7fd01eb11515)

## Features

- Monitor specific changes on a webpage
- Send notifications via email and SMS when changes are detected
- Show history records on a spreadsheet

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

## Setting Environment Variables:

Create .env file in the root directory of the project, and add your environment variables:

or

You can also check example.env file

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
EMAIL_RECEIVER_ADDRESS=receiver_email_address
SMS_RECEIVER_NUMBER=receiver_phone_number
```

To be able to run the app, you must set url links, sending a post request to

```sh
"http://localhost:8000/targetlink/add"
example req.body = {
"urls": ["youexampleweblink.com/","www.kahyaogluegecan.tech", "https://translate.google.com/", "https://www.makeuseof.com/using-galaxy-watch-with-iphone/" ]
}
```

Please do not forget including googlesheets credentials keyfile as json file!

## Important Notes

1)When comparing website contents, I've observed that many sites use dynamic variables and attribute names, often based on the current date, to guard against XSS attacks. This causes the contentHasChanged variable to consistently return true. To mitigate this, I've incorporated the Cheerio npm package, which excludes style and script tags, as well as attribute names. However, this approach makes the comparison less stringent. Therefore, any design changes on the website may go undetected as the code excludes style tags. Despite my efforts, some sites still indicate a change in content. This is due to dynamic elements, such as a clock or other variables, that constantly change.

You can always revert or adjust this by modifying the code in htmlSimplifier.js

2)Since TWILIO API costs me credits(real money $🙈), I usually comment out the SMS_Sending function in Services.js line 103-106. Please make sure it is commented in.

3)When it runs for the first time, it will not display the spreadsheet data nor send any notifications, as there is no cached data to show.

Developed by Egecan Kahyaoglu.
