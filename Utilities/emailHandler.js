const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: 'smtp.ethereal.email',
    // port: 587,
    // auth: {
    //     user: 'antonette54@ethereal.email',
    //     pass: 'BmbY2SYExP3pHqmY1N'
    // }

    //Gmail
    // service : 'Gmail',
    // auth : {
    //     user : 'ahmedrashad13281@gmail.com',
    //     pass : '130130Bb!',
        
    // }

    //SendGrid
    host : 'smtp.sendgrid.net',
    port : 587,
    auth : {
        user : process.env.SENDGRID_USER,
        pass : process.env.SENDGRID_PASS
    }
});

module.exports = transporter