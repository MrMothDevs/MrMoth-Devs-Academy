var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

mongoose.connect("mongodb+srv://mda:mdaforlife@mda.su5xl.mongodb.net/mda?retryWrites=true&w=majority", {
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

app.use('/', indexRouter);
app.use('*', indexRouter);
app.use('/signup', indexRouter);
app.use('/profile', indexRouter);
app.use('/courses', indexRouter);
app.use('/contact', indexRouter);
app.use('/login', indexRouter);
app.use('/users', usersRouter);

// Post Requests //
app.post('/signup', async(req, res) => {
  const { email, password } = req.body;

    // check for missing fields
    if (!email || !password) {
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
    const latestUser = new User({ email, password: hashedPassword });

    latestUser
      .save()
      .then(() => {
        res.send("registered account!");
        return;
      })
      .catch((err) => console.log(err));
})  

app.post('/login', (req, res) => {

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
