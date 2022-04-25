const dotenv = require('dotenv/config');
const config = require('../config');
const sender = config.messageService.sender;
const messagebird = require("messagebird")(`${config.messageService.accessKey}`);
const responseHandler = require('../utils/ResponseHandler');
const {StatusCodes} = require('../utils/UtilConstants');

let sendMessage = async function (req, res, recipients, body, cronJob = true) {
  console.log(req, res, recipients, body, cronJob);
  messagebird.messages.create({
      originator: sender,
      recipients: recipients,
      body: body
    },
    function (err, response) {
      console.log(err, response);
      if (err) {
        return responseHandler(false, StatusCodes.BadRequest, 'Error', 'Message Not Sent', res, err, req, cronJob);
      } else {
        return responseHandler(true, StatusCodes.Ok, 'Success', 'Message Sent', res, response, req, cronJob);
      }
    }
  );
};


module.exports = {
  messageService: {
    sendMessage
  }
};
