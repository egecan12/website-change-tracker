# Website Monitoring API

This is an API that monitors specific changes on a webpage. It's built with Node.js and Express, and uses MongoDB for the database.

## Project Diagram

![diagram](https://github.com/egecan12/website-change-tracker/assets/45043515/6c61d894-8149-4505-a07c-bf105a09afb5)

## Features

- Monitor specific changes on a webpage
- Send notifications via email and SMS when changes are detected
- Show history records on a spreadsheet

## Prerequisites

- Node.js
- npm
- MongoDB Atlas Conenction String
- SendGrid account API credentials
- Twilio account API credentials
- Google Sheets API keyfile

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
DB_URI=add_your_mongodb_uri
SENDGRID_API_KEY=add_your_api_key
SENDGRID_SENDER=add_your_sender_email
TWILIO_ACCOUNT_SID=add_your_SID
TWILIO_AUTH_TOKEN=add_your_token
TWILIO_PHONE_NUMBER=add_your_sender_phone_number
SPREADSHEET_KEYFILE_NAME=add_your_keyfile_filename_here
SPREADSHEET_ID=add_your_id
SPREADSHEET_RANGE=add_your_range_as_Sheet1!A1
EMAIL_RECEIVER_ADDRESS=add_your_email_address
SMS_RECEIVER_NUMBER=add_your_number_as_+15555555555
CRON_TIMER=add_cron_schedule_as_*/5 * * * *
PORT=
HOST=
```

To be able to make the app work, you must set url links, sending a post request to

```sh
"http://localhost:8000/targetlink/add"
{
    "urls": ["kahyaogluegecan.tech/sample-page", "https://cheerio.js.org/docs/intro", "https://www.imdb.com/title/tt0112573/", "https://www.apple.com/"]
}
```

also you can delete the urls that yoou do not want to track anymore, sending a delete request.

```sh
"http://localhost:8000/targetlink/delete"
{
    "urls": ["kahyaogluegecan.tech/sample-page", "https://cheerio.js.org/docs/intro", "https://www.imdb.com/title/tt0112573/", "https://www.apple.com/"]
}
```

The "Node-Cron" module has been installed to configure the app to call the `start` function when the project starts running, initiating its process. The start time for the application logic can be scheduled by setting the `CRON_TIMER` environment variable.

Please do not forget including Google Spreadsheet credential keyfile as a json file!

## Important Notes

1)When comparing website contents, I've observed that many sites use dynamic variables and attribute names, often based on the current date, to guard against XSS attacks. This causes the contentHasChanged variable to consistently return true. To mitigate this, I've incorporated the Cheerio npm package, which excludes style and script tags, as well as attribute names. However, this approach makes the comparison less stringent. Therefore, any design changes on the website may go undetected as the code excludes style tags. Despite my efforts, some sites still indicate a change in content. This is due to dynamic elements, such as a clock or other variables, that constantly change.

You can always revert or adjust this by modifying the code in htmlSimplifier.js

2)Since TWILIO API costs me credits(real money $🙈), I usually comment out the SMS_Sending function in Services.js line 103-106. Please make sure it is commented in.

3)When it runs for the first time, it will not display the spreadsheet data nor send any notifications, as there is no cached data to show.

Developed by Egecan Kahyaoglu.
