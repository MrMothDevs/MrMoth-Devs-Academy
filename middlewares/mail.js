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
        to: `${process.env.emailReceiver}`,
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
const sendConfirmationEmail = (name, email, confirmationCode) => {
    transporter.sendMail({
      from: `${process.env.emailReceiver}`,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
  };
  // Exporting the sendmail
  module.exports = sendMail;
  module.epxorts = sendConfirmationEmail;