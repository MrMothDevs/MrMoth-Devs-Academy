var express = require('express');
var router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser.js");
const db = require("../models");
const User = db.user;
const Courses = db.courses


//Main Page
router.get('/', async function (req, res, next) {
  if (!req.session.user){
   return res.render('index', { user: req.session.user, permissions: 'User'})
  }
  const Member = await User.findOne({
    username: req.session.user.username,
  })
  res.render('index', { user: req.session.user, permissions: Member.permissions })

})


//Sign Up Page
router.get('/signup', function (req, res, next) {
  res.render('signup', { user: req.session.user });
});

router.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  if (req.originalUrl === '/logout?saved') {
    return res.redirect('/login?success')
  }
  res.redirect("/login");
});

//Profile Page
router.get('/profile', async function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  console.log(req.session.user)
  let username = req.session.user.username
  let email = req.session.user.email
  let inventory = req.session.user.inventory
  let permissions = req.session.user.permissions
  console.log(req.originalUrl)
  if (req.originalUrl === '/profile?success') {
    res.redirect('/logout?saved')
  }
  console.log(inventory)
  res.render('profile', { username: username, email: email, users: inventory, permissions: permissions});
});

//Courses Page
router.get('/courses', async function (req, res, next) {
  if (req.originalUrl === '/courses?error') {
    Courses.find({}).then(async function (course) {
      let alert2 = { msg: 'You have already purchased this course!', location: 'body' }
      return res.render('courses', { user: req.session.user, course: course, alert2: alert2, permissions: Member.permissions});
    })
  }
  Courses.find({}).then(async function (course) {
    if (req.session.user){
      const Member = await User.findOne({
        username: req.session.user.username,
      })
      return res.render('courses', {  user: req.session.user, course: course, permissions: Member.permissions})
     }else {
      return res.render('courses', { user: req.session.user, course: course, permissions: 'User'});
     }
  })
});

//Members Page
router.get('/members', async function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  const Member = await User.findOne({
    username: req.session.user.username,
  })
  if(Member.permissions == "Admin"){
    User.find({}).then(await function (members) {
    return res.render('members', { user: req.session.user, members: members });
    })
  } else {
    res.redirect('/profile')
  }
})

//Contact Page
router.get('/contact', function (req, res, next) {
  let alert3 = { msg: 'The email has been successfully sent!', location: 'body' }
  if (req.originalUrl === '/contact?success') {
    return res.render('contactUs', { user: req.session.user, alert3 });
  }
  res.render('contactUs', { user: req.session.user });
});

//Login Page
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

//Konfirmi i akauntit 
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

//Blerja e nje kursi
router.get("/courses/purchase/:id", (req, res, next) => {
  Courses.findOne({
    id: req.params.id,
  })
    .then(async (course) => {
      if (!req.session.user) {
        return res.redirect('/login')
      }
      const Member = await User.findOne({
        username: req.session.user.username,
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

//404 Page
router.get('*', function (req, res, next) {
  res.render('404', { user: req.session.user });
});
module.exports = router;
