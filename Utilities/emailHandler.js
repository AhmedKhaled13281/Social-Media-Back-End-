const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  // Send Grid
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: "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",
  },

  //ZOHO
//   host: "smtp.zoho.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "ahmedrashad13281@zohomail.com",
//     pass: "130130Bb!",
//   },
});

module.exports = transporter;
