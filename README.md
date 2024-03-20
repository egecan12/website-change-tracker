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
HOST=for_deployment_set_0.0.0.0
SECRET_KEY=crete_your_own_key_as_random_numbers
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

## Deploy it Server

## Try it on my test server

For testing purposes, the cron job has been disabled and no triggers have been set. This allows you to manually trigger it via Postman.

```sh
https://website-change-tracker.onrender.com
```

You can import my Postman collection to access the endpoints.It is located in the project root.

Please note that you will not receive notifications as my email and phone number are set as the receiver in the environment variables. However, you can check the results in my Google Spreadsheet:

```sh
https://docs.google.com/spreadsheets/d/1ZQ1BrY_xqKSF79Mq7tNHmYuHMecmUVYBaDYau_sR54o/edit#gid=0
```

## Important Development Notes

1)The "Node-Cron" module has been installed to configure the app to call the `start` function when the project starts running, initiating its process. The start time for the application logic can be scheduled by setting the `CRON_TIMER` environment variable.

There are two options to run the app automatically. First, you can set the `CRON_TIMER` environment variable. If this variable is not set, the second option is to trigger the `${host}/api/run-operation` endpoint, sending a GET Request, using a service like Amazon CloudWatch Events.

2)Since TWILIO API costs me credits(real money $🙈), I usually comment out the SMS_Sending function in Services.js line 103-106. Please make sure it is commented in.

Please do not forget including Google Spreadsheet credential keyfile as a json file!

## Additional Notes

1)When comparing website contents, I've observed that many sites use dynamic variables and attribute names, often based on the current date, to guard against XSS attacks. This causes the contentHasChanged variable to consistently return true. To mitigate this, I've incorporated the Cheerio npm package, which excludes style and script tags, as well as attribute names. However, this approach makes the comparison less stringent. Therefore, any design changes on the website may go undetected as the code excludes style tags. Despite my efforts, some sites still indicate a change in content. This is due to dynamic elements, such as a clock or other variables, that constantly change.

You can always revert or adjust this by modifying the code in htmlSimplifier.js

2)When it runs for the first time, it will not display the spreadsheet data nor send any notifications, as there is no cached data to show.

Developed by Egecan Kahyaoglu.
