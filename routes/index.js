var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
const db = require("../models");
const User = db.user;
const Courses = db.courses
//Get the main page
router.get('/', function (req, res, next) {
  res.render('index', { username: req.session.user })
})


//Get the signup page
router.get('/signup', function (req, res, next) {
  res.render('signup', { username: req.session.user });
});

router.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  if (req.originalUrl === '/logout?saved') {
    return res.redirect('/login?success')
  }
  res.redirect("/login");
});
//Get the profile page
router.get('/profile', async function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  console.log(req.session.user)
  let username = req.session.user.username
  let email = req.session.user.email
  let pfp = req.session.user.pfp
  console.log(req.originalUrl)
  if (req.originalUrl === '/profile?success') {
    res.redirect('/logout?saved')
  }
  const Member = await User.findOne({
    user: req.session.user.user,
  })
  console.log(Member)
  res.render('profile', { username: username, email: email, pfp: pfp, users: Member.inventory});
});

//Get the courses page
router.get('/courses', async function (req, res, next) {
  if (req.originalUrl === '/courses?error') {
    Courses.find({}).then(await function (course) {
      let alert2 = { msg: 'You have already purchased this course!', location: 'body' }
      return res.render('courses', { username: req.session.user, course: course, alert2 });
    })
  }
  Courses.find({}).then(await function (course) {
    res.render('courses', { username: req.session.user, course: course });
  })
});

router.get('/members', function (req, res, next) {
  res.render('members', { username: req.session.user });
})
//Get the contact page
router.get('/contact', function (req, res, next) {
  let alert3 = { msg: 'The email has been successfully sent!', location: 'body' }
  if (req.originalUrl === '/contact?success') {
    return res.render('contactus', { username: req.session.user, alert3 });
  }
  res.render('contactus', { username: req.session.user });
});

//Get the login page
router.get('/login', function (req, res, next) {
  if (req.session.user) {
    return res.redirect('/')
  }
  let alert3 = { msg: 'The profile has been successfully updated!', location: 'body' }
  if (req.originalUrl === '/login?success') {
    return res.render('login', { alert3 });
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
router.get("/courses/purchase/:id", (req, res, next) => {
  Courses.findOne({
    id: req.params.id,
  })
    .then(async (course) => {
      if (!req.session.user) {
        return res.redirect('/login')
      }
      const Member = await User.findOne({
        user: req.session.user.user,
      })
      console.log(Member)
      console.log(course);
      if (!course) {
        return res.status(404).send({ message: "Course Not found." });
      }
      let title = course.title

      if (Member.inventory.includes(title)) {
        return res.redirect('/courses?error')
      }
      Member.inventory.push(title);
      Member.save(console.log('done'));
      res.redirect('/profile')
    })
    .catch((e) => console.log("error", e));
})
//Get the 404 page
router.get('*', function (req, res, next) {
  res.render('404', { username: req.session.user });
});
module.exports = router;
