const dotenv = require("dotenv/config");
const cron = require("node-cron");
const EmailTask = require('./tasks/EmailTask');
const MessageTask = require('./tasks/MessageTask')
const express = require('express');
const app = express();
// sending emails every minute
cron.schedule("* * * * *", async function(){
    console.log("---------------------");
    console.log("Running Email Cron Job");
    await EmailTask(null, null, false);
});

cron.schedule("* * * * *", async function(){
    console.log("---------------------");
    console.log("Running SMS Cron Job");
    await MessageTask(null, null, null, false);
});