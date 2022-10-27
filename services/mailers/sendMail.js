const nodemailer = require('nodemailer');
//const logger = require('../services/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = (mailOptions) => {
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) return console.log(err);
    if (info) return console.log(info);
    return null;
  });
};