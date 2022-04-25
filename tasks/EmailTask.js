const { emailService } = require("../Services/mailService");
const path = require("path");
const fs = require("fs/promises");
const responseHandler = require('../utils/ResponseHandler');
let EmailTask = async function (req, res, isAPI = false) {
  if(!isAPI){
    let [users, emails] = await Promise.all([
      fs.readFile(path.resolve(__dirname, "../inputs/subscribers.json"), 'utf-8'),
      fs.readFile(path.resolve(__dirname, "../inputs/emails.json"), 'utf-8'),
    ]);
    emails = JSON.parse(emails);
    users = JSON.parse(users);
    for (let i = 0; i < emails.length; i++) {
        console.log(emails[i], emails[i].failedEmailIds.length);
      if (!emails[i].status && emails[i].failedEmailIds.length) {
          //send to only failed subscribers
        let emailResponse = await emailService.sendEmail(
          emails[i].failedEmailIds,
          emails[i].subject,
          emails[i].text,
          emails[i].html,
          true,
          req,
          res
        );
        if(emailResponse.status){
          emails[i].successEmailIds = [...emails[i].successEmailIds, ...emailResponse.response.accepted],
          emails[i].failedEmailIds = [];
          emails[i].status = 1; //set status = 1 as emails are sent
        } else {
          emails[i].successEmailIds = [...emails[i].successEmailIds, ...emailResponse.response.accepted],
          emails[i].failedEmailIds = [...emails[i].failedEmailIds, ...emailResponse.response.rejected];
          emails[i].status = 0;
        }
      } else if (!emails[i].status && !emails[i].failedEmailIds.length){
          //send to all subscribers
          let emailResponse = await emailService.sendEmail(
              users.map(x => x.email),
              emails[i].subject,
              emails[i].text,
              emails[i].html,
              true,
              req,
              res
          );
          if(emailResponse.status) {
              emails[i].successEmailIds = [...emailResponse.response.accepted], 
              emails[i].status = 1;
          }
      } else if( emails[i].status === 1){
          continue;
      }
      fs.writeFile(path.resolve(__dirname, "../inputs/emails.json"), JSON.stringify(emails, null, 2), 'utf-8');
    }
  } else {
    let {to, subject, text, html} = req.body;
    await emailService.sendEmail(to, subject, text, html, false, req, res);
  }
}

module.exports = EmailTask;
