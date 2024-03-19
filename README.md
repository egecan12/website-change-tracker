# Website Monitoring App

This is a web application that monitors specific changes on a webpage. It's built with Node.js and Express, and uses MongoDB for the database.

## Project Diagram

![diagram](https://github.com/egecan12/website-change-tracker/assets/45043515/70c66fc4-b53d-4d72-998e-7fd01eb11515)

## Features

- Monitor specific changes on a webpage
- Send notifications via email and SMS when changes are detected

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
DB_URI=your_mongodb_uri
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_SENDER=your_sendgrid_sender_email
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

To be able to run the app, you must set url links, sending a post request to
"http://localhost:8000/targetlink/add"
example req.body = {
"urls": ["mern-redux-twitter-clone.onrender.com/","https://www.google.com/search?client=firefox-b-d&q=homesense+luggage+buy", "https://translate.google.com/", "https://www.makeuseof.com/using-galaxy-watch-with-iphone/" ]
}

Please do not forget icluding googlesheets credentials key website-tracker-app-1b96223482da.json

by Egecan Kahyaoglu
