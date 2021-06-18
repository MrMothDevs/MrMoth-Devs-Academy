var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
//Get the main page
router.get('/', function(req, res, next) {
  const bruh = req.session.user
  res.render('index',{username: bruh})
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
  res.render('profile');
});

//Get the courses page
router.get('/courses', function(req, res, next) {
  res.render('courses');
});

//Get the contact page
router.get('/contact', function(req, res, next) {
  res.render('contactus');
});

//Get the login page
router.get('/login', function(req, res, next){
  res.render('login')
})

  //Get the 404 page
  router.get('*', function(req, res, next) {
    res.render('404');
  });
  module.exports = router;
