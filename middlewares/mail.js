const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: '587',
    auth: {
        user: process.env.USER,
        pass: process.env.SECRET
    }
});

//Emaili qe vin nga forma e contact us
const sendMail = (fname, lname, email, message) => {
    const mailOptions = {
        sender: fname, lname,
        from: email,
        to: `${process.env.emailReceiver}`,
        subject: "New email from MDA",
        text: message
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log(err, null);
        } else {
            console.log(null, data);
        }
    });
}

//Emaili qe dergohet te perdorues per verifikimin e akauntit
const sendConfirmationEmail = (name, email, confirmationCode) => {
    const mailOptions = {
        from: `${process.env.emailReceiver}`,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Verify Your Account</h1>
        <h2>Hello ${name}</h2>
        <p> You registered an account on MDA, before being able to use your account you need to verify that this is your email address by clicking here:<a href=https://mrmothdevs.herokuapp.com/confirm/${confirmationCode}>Activate Account</a></p>
        Kind Regards, MDA Team
        </div>`,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log(err, null);
        } else {
            console.log(null, data);
        }
    });
}


// Eksportojm sendmail dhe sendConfirmationEmail
module.exports = { sendMail, sendConfirmationEmail }
