const dotenv = require("dotenv/config");
const EmailTask = require('./tasks/EmailTask');
const MessageTask = require('./tasks/MessageTask');
const PORT = process.env.PORT || 2000;
const express = require('express');
const app = express();

app
    .post('/sendEmail', EmailTask(req, res, true))
    .post('/sendMessage', MessageTask(req, res, true))

app.listen(PORT, ()=>{
    console.debug('Server running at:', PORT );
})