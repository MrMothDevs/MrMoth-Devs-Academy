var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { body, validationResult } = require('express-validator')
// Configurimi i dotenv, ka informacione te rendesishme qe duhen per te ven ne pun aplikacionin
require('dotenv').config()
const db = require("./models");
const User = db.user;
let port = ('5500')
var indexRouter = require('./routes/index');
const sendMail = require('./middlewares/mail');
var jwt = require("jsonwebtoken");
const session = require('express-session');

var app = express();


// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

//Lidhja me databasen (Mongodb x Mongoose)
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

//Ruajtja e sezjoneve (me express-session)
app.use(session({
  secret: `${process.env.session_secret}`,
  resave: false,
  saveUninitialized: false,
  expires: 300000,
}));

//Redirekti i routerit kryesor
app.use('/', indexRouter);

// Post Requests //

//Rregjistrimi i perdoruesit
app.post('/signup', body('username', 'This username must be 3+ characters long').isLength({ min: 3 }), body('password', 'This password must be 6+ characters long').isLength({ min: 6 }), async (req, res) => {
  const { email, password, username, birthday, gender } = req.body;
  let pfp = 'images/avatar.png'
  // Kontroll i formave
  if (!email || !password || !username || !birthday || !gender) {
    res.send("Please enter all the fields");
    return;
  }

  //Nese gjejm probleme i bejm render faqes bashk me problemim
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
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

  // I bejm passwordid Hash 
  const token = jwt.sign({ email: email }, process.env.token_secret);
  const hashedPassword = await bcrypt.hash(password, 12);
  const latestUser = new User({ email, password: hashedPassword, username, birthday, gender, pfp, confirmationCode: token,});
  latestUser
    .save()
    .then(() => {
      sendMail.sendConfirmationEmail(
        latestUser.username,
        latestUser.email,
        latestUser.confirmationCode
      );
      
      let alert3 = { msg: 'User was registered successfully! Please check your email', location: 'body' }
      res.render('signup', {
        alert3
      })
      return;
    })
    .catch((err) => console.log(err));
})

//Logimi i perdoruesit
app.post('/login', body('email', 'There is something wrong with the email.').isEmail(), body('password', 'This password must be 6+ characters long').isLength({ min: 6 }), async (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  
  //Nese gjejm probleme i bejm render faqes bashk me problemim
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const alert = errors.array()
    console.log(alert)
    res.render('login', {
      alert
    })
    return;
  }
  const { email, password } = req.body;

  // Kontrolli i formave dhe validimi i tyre
  if (!email || !password) {
    res.send("Please enter all the fields");
    return;
  }

  //Kerkojm per perdoruesin ne databaz
  const Member = await User.findOne({ email });

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
  if (Member.status != "Active") {
    let alert2 = { msg: 'Pending Account. Please check your email to verify this account!', location: 'body' }
    res.render('login', {
      alert2
    })
    return;
  }
  let pfp = Member.pfp
  let username = Member.username
  let inventory = Member.inventory
  let permissions = Member.permissions

  // Logged in
  req.session.user = {
    username,
    email,
    pfp, 
    inventory,
    permissions
  };
  res.redirect("/profile");
})

//Editimi i profilit te perdoruesit
app.post('/edit', async (req, res) => {
  const { editName, editPass} = req.body;

  // Kontrolli i formave dhe validimi i tyre
  let username = req.session.user.username
  let newUsername = editName
  let newPassword = editPass
  console.log(newUsername,  newPassword)
  if (!newUsername || !newPassword) {
    res.send("Please enter all the fields");
    return;
  }

  // I bejm passwordid Hash 
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  const Member = await User.findOne({ username });
  console.log(Member.username)
  const Update = User.findOneAndUpdate({username: Member.username}, { username: newUsername, password: hashedPassword })
  Update.then(
    res.redirect('/profile?success')
  )
})

//Dergesa e nje emaili te MDA (Contact Us)
app.post('/email', async (req, res) => {
  const { fname, lname, email, message } = req.body;

  // Kontrolli i formave dhe validimi i tyre
  if (!fname || !lname || !email || !message) {
    res.send("Please enter all the fields");
    return;
  }

  // Dergese e emailit te MDA
  sendMail.sendMail(fname, lname, email, message, function (err, data) {
    if (err) {
      let alert2 = { msg: 'Internal Error. Your email could not be sent!', location: 'body' }
      res.render('contact', {
        alert2
      })
    } else {
    }
  })
  res.redirect("/contact?success");
})

// Nese perdoruesi hap nje faqe jo egzsistuese
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Bejm render faqen me error
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => console.info(`Listening on port ${port}`));
module.exports = app;

