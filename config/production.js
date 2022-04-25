module.exports = {
    emailService: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        sender: process.env.EMAIL_SENDER
    }
}