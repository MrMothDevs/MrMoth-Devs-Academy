var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('dotenv').config()
const User = require("./models/User");
let port = ('5500')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
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
    secret: 'verysecretlmfaoo3294i2034u92hr43u92',
    resave: false,
    saveUninitialized: false,
    expires: 300000,
  }));
  
app.use('/', indexRouter);
app.use('/users', usersRouter);



// Post Requests //
app.post('/signup', async(req, res) => {
  const { email, password, username, birthday, gender } = req.body;

    // check for missing fields
    if (!email || !password || !username || !birthday || !gender) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExitsAlreay = await User.findOne({ email });

    if (doesUserExitsAlreay) {
      res.send("A user with that email already exits please try another one!");
      return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, password: hashedPassword, username, birthday, gender });

    latestUser
      .save()
      .then(() => {
        res.send("registered account!");
        return;
      })
      .catch((err) => console.log(err));
})  

app.post('/login', async(req, res) => {
  if (req.session.user){
    return res.redirect("/"); 
  }
    const { username, password } = req.body;

    // check for missing fields
    if (!username || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const doesUserExits = await User.findOne({ username });

    if (!doesUserExits) {
      res.send("invalid username or password");
      return;
    }

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExits.password
    );

    if (!doesPasswordMatch) {
      res.send("invalid useranme or password");
      return;
    }

    // else logged in
    req.session.user = {
      username,
    };
    res.redirect("/");
})  
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(port, () => console.info(`Listening on port ${port}`));
module.exports = app;
