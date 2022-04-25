module.exports = {
    emailService: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        sender: 'Neeraj Srivastava 👻 <nsrivastava645@gmail.com>'
    },
    messageService: {
        sender: process.env.MESSAGEBIRD_SENDER,
        accessKey: process.env.MESSAGEBIRD_ACCESS_KEY
    }
}