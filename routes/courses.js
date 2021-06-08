var express = require('express');
var router = express.Router();
//Get the courses page
router.get('/courses', function(req, res, next) {
    res.render('courses');
  });

  module.exports = router;
