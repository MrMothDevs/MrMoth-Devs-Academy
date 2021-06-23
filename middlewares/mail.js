const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const auth = {
    auth: {
        api_key: `${process.env.nodemailer_api_key}`,
        domain: `${process.env.nodemailer_domain}`
    }
};
const transporter = nodemailer.createTransport(mailGun(auth));
const sendMail = (fname, lname, email, message,cb) => {
    const mailOptions = {
        sender: fname, lname,
        from: email,
        to: 'remixors@gmail.com',
        subject: "New email from MDA",
        text: message
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, data);
        }
    });
}
  // Exporting the sendmail
  module.exports = sendMail;