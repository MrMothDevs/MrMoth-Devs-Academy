var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator')
const bodyParser = require('body-parser')
require('dotenv').config()
const db = require("./models");
const User = db.user;
const Role = db.role;
let port = ('5500')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const sendMail = require('./middlewares/mail');
var jwt = require("jsonwebtoken");

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log("connected to mongodb cloud!");
  })
  .catch((err) => {
    console.log(err);
  });
const session = require('express-session');
app.use(session({
  secret: `${process.env.session_secret}`,
  resave: false,
  saveUninitialized: false,
  expires: 300000,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// Post Requests //
app.post('/signup', body('username', 'This username must be 6+ characters long').isLength({ min: 6 }), body('password', 'This password must be 6+ characters long').isLength({ min: 6 }), async (req, res) => {
  const { email, password, username, birthday, gender } = req.body;
  let pfp = 'images/avatar.png'
  // check for missing fields
  if (!email || !password || !username || !birthday || !gender) {
    res.send("Please enter all the fields");
    return;
  }
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    res.render('signup', {
      alert
    })
  }
  const doesUserExitsAlreay = await User.findOne({ email });

  if (doesUserExitsAlreay) {
    let alert2 = { msg: 'The email you entered is already used by another account!', location: 'body' }
    res.render('signup', {
      alert2
    })
    return;
  }

  // lets hash the password
  const token = jwt.sign({ email: email }, process.env.token_secret);
  const hashedPassword = await bcrypt.hash(password, 12);
  const latestUser = new User({ email, password: hashedPassword, username, birthday, gender, pfp, confirmationCode: token,});
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  latestUser
    .save()
    .then(() => {
      res.send({
        message:
          "User was registered successfully! Please check your email",
      });
      nodemailer.sendConfirmationEmail(
        user.username,
        user.email,
        user.confirmationCode
      );
      let alert2 = { msg: 'Registered account', location: 'body' }
      res.render('signup', {
        alert2
      })
      return;
    })
    .catch((err) => console.log(err));
})

app.post('/login', body('username', 'This username must be 6+ characters long').isLength({ min: 6 }), body('password', 'This password must be 6+ characters long').isLength({ min: 6 }), async (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    // return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    console.log(alert)
    res.render('login', {
      alert
    })
    return;
  }
  const { username, password } = req.body;

  // check for missing fields
  if (!username || !password) {
    res.send("Please enter all the fields");
    return;
  }

  const Member = await User.findOne({ username });

  if (!Member) {

    let alert2 = { msg: 'This user does not exist!', location: 'body' }
    res.render('login', {
      alert2
    })
    return;
  }

  const doesPasswordMatch = await bcrypt.compare(
    password,
    Member.password
  );

  if (!doesPasswordMatch) {
    let alert2 = { msg: 'Invalid username or password', location: 'body' }
    res.render('login', {
      alert2
    })
    return;
  }
  if (user.status != "Active") {
    return res.status(401).send({
      message: "Pending Account. Please Verify Your Email!",
    });
  }
  let email = Member.email
  let pfp = Member.pfp
  console.log(pfp)
  // else logged in
  req.session.user = {
    username,
    email,
    pfp
  };
  res.redirect("/profile");
})
app.post('/email', async (req, res) => {
  const { fname, lname, email, message } = req.body;

  // check for missing fields
  if (!fname || !lname || !email || !message) {
    res.send("Please enter all the fields");
    return;
  }
  const data = { fname, lname, email, message }
  console.log('Data:', data);
  //res.json({message: 'Message received!'})
  sendMail(fname, lname, email, message, function (err, data) {
    if (err) {
      res.status(500).json({ message: 'Internal Error' });
    } else {
      res.status({ message: 'Email sent!!!' });
    }
  })
  res.redirect("/contact");
})

app.post(verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, () => console.info(`Listening on port ${port}`));
module.exports = app;
