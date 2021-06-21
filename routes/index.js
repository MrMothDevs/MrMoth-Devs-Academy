var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
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
  res.redirect("/login", {username: req.session.user});
});
  //Get the profile page
router.get('/profile', function(req, res, next) {
  if (!req.session.user){
    return res.redirect('/404');
  }
  console.log(req.session.user)
  let username = req.session.user.username
  let email = req.session.user.email
  res.render('profile', {username: username, email: email});
});

//Get the courses page
router.get('/courses', function(req, res, next) {
  res.render('courses', {username: req.session.user});
});

//Get the contact page
router.get('/contact', function(req, res, next) {
  res.render('contactus', {username: req.session.user});
});

//Get the login page
router.get('/login', function(req, res, next){
  if (req.session.user){
    return res.redirect('/')
  }
  res.render('login');
});

  //Get the 404 page
  router.get('*', function(req, res, next) {
    res.render('404', {username: req.session.user});
  });
  module.exports = router;
