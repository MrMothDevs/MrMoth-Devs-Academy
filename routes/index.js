var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
//Get the main page
router.get('/', function(req, res, next) {
  res.render('index',{username: req.session.user})
  .catch((e) => {
    console.log(e);
    res.render('error', { message: e.message });
  });
  })
   

//Get the signup page
router.get('/signup', function(req, res, next) {
    res.render('signup');
  });
  
router.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});
  //Get the profile page
router.get('/profile', function(req, res, next) {
  res.render('profile', {username: req.session.user});
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
  res.render('login')
})

  //Get the 404 page
  router.get('*', function(req, res, next) {
    res.render('404'), {username: req.session.user};
  });
  module.exports = router;
