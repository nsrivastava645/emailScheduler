const dotenv = require('dotenv/config');
const nodemailer = require('nodemailer');
const config = require('../config');
const responseHandler = require('../utils/ResponseHandler');
const {StatusCodes} = require('../utils/UtilConstants');

async function createTestAccount() {
    return await nodemailer.createTestAccount();
}

async function sendEmail(to, subject, text, html, cronJob = true, req, res){
    let auth = {}
    if(process.env.NODE_ENV === 'development') {
        let testAccount = await createTestAccount();
        auth = {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          }
    } else {
        auth = {
            user: config.emailService.user,
            pass: config.emailService.pass
        }
    }
    let transporter = nodemailer.createTransport({
        host: config.emailService.host,
        port: config.emailService.port,
        secure: config.emailService.port === 465, // true for 465, false for other ports
        auth: auth,
    });
    let emailResponse = await emailSender(transporter, config.emailService.sender, to.join(', '), subject, text, html);
    if(emailResponse) {
        if(emailResponse.rejected.length){
            let count = 1;
            while(emailResponse.rejected.length && count <= 5){
                emailResponse = await emailSender(transporter, config.emailService.sender, emailResponse.rejected.join(', '), subject, text, html);
                count+=1;
            }
            if(emailResponse.rejected.length){
                return responseHandler(false, StatusCodes.BadRequest, 'Error', 'Email Not Sent', res, emailResponse, req, cronJob);
            } else {
                return responseHandler(true, StatusCodes.Ok, 'Success', 'Email Sent', res, emailResponse, req, cronJob);
            }
        } else if (emailResponse.messageId){
            console.log(emailResponse);
            return responseHandler(true, StatusCodes.Ok, 'Success', 'Email Sent', res, emailResponse, req, cronJob);
        }
    } else {
        return responseHandler(false, StatusCodes.BadRequest, 'Error', 'Email Not Sent', res, null, req, cronJob);
    }
}
const emailSender = async (transporter, from, to, subject, text, html) => {
    return await transporter.sendMail({
        from,
        to, 
        subject,
        text,
        html
    });
}
module.exports = {
    emailService: {
        sendEmail
    }
};