var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
const db = require("../models");
const User = db.user;
//Get the main page
router.get('/', function(req, res, next) {
  res.render('index',{username: req.session.user})
  })
   

//Get the signup page
router.get('/signup', function(req, res, next) {
    res.render('signup', {username: req.session.user});
  });
  
router.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  if(req.originalUrl === '/logout?saved'){
    return res.redirect('/login?success')
  }
  res.redirect("/login");
});
  //Get the profile page
router.get('/profile', function(req, res, next) {
  if (!req.session.user){
    return res.redirect('/404');
  }
  console.log(req.session.user)
  let username = req.session.user.username
  let email = req.session.user.email
  let pfp = req.session.user.pfp
  console.log(req.originalUrl)
  if(req.originalUrl === '/profile?success'){
    res.redirect('/logout?saved')
  }
  res.render('profile', {username: username, email: email, pfp: pfp});
});

//Get the courses page
router.get('/courses', function(req, res, next) {
  res.render('courses', {username: req.session.user});
});

router.get('/members', function(req, res, next) {
  res.render('members', {username: req.session.user});
})
//Get the contact page
router.get('/contact', function(req, res, next) {
  res.render('contactus', {username: req.session.user});
});

//Get the login page
router.get('/login', function(req, res, next){
  if (req.session.user){
    return res.redirect('/')
  }
  let alert3 = { msg: 'The profile has been successfully updated!', location: 'body' }
  if(req.originalUrl === '/login?success'){
    return res.render('login', {alert3});
  }
  res.render('login');
});

router.get("/confirm/:confirmationCode", (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      res.redirect('/login')
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
})
  //Get the 404 page
  router.get('*', function(req, res, next) {
    res.render('404', {username: req.session.user});
  });
  module.exports = router;
