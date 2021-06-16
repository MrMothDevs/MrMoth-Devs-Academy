var express = require('express');
var router = express.Router();
//Get the main page
router.get('/', function(req, res, next) {
    res.render('index');
  });

//Get the signup page
router.get('/signup', function(req, res, next) {
    res.render('signup');
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
