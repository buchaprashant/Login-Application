var express = require('express');
var users = require('../models/users');
var authenticate = require('../authenticate');

var router = express.Router();

router.get('/profile', authenticate.verifyUser, function (req, res, next) {
  var username = req.cookies['username'];
  if (req.query.loadType == 'partial') {
    res
    .append('loginStatus','Logged In')    
    .render('profile', {
      'username': username
    });
  }
  else {
    res.render('index', {
      'loginStatus': 'Logged In',
      'page': 'profile',
      'username': username
    });
  }
});

router.route('/login')
  .get((req, res, next) => {
    //if user is already logged in, redirect to his profile
    if (req.cookies['token']) {
      return res.redirect('/users/profile');
    }
    if (req.query.loadType == 'partial') {
      res
        .append('loginStatus', 'Not Logged In')
        .render('login');
    }
    else{
      res.render('index', {
        'loginStatus': 'Not Logged In',
        'page': 'login'
      });
    }
  })
  .post((req, res, next) => {
    //if user is already logged in, redirect to his profile
    if (req.cookies['token']) {
      return res.redirect('/users/profile');
    }
    var randomTimer1To3Seconds = (Math.floor(Math.random() * 3) + 1) * 1000;
    setTimeout(() => {
      if (req.body.username && req.body.password) {
        var username = req.body.username;
        var password = req.body.password;
      }

      // usually this would be a database call
      var user = users.find(element => element.username == username);
      if (!user) {
        res.status(401).json({ success: false, message: "Invalid Username" });
      }
      else {
        if (user.password === password) {
          // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
          var payload = { id: user.id };
          var token = authenticate.getToken(payload);
          res.statusCode = 200;
          res.cookie("token", token);
          res.cookie("username", username);
          res.json({ success: true, errorMessage: null });
        }
        else {
          res.status(401).json({ success: false, message: "Invalid Password" });
        }
      }
    }, randomTimer1To3Seconds);

  });

router.route('/logout')
  .post((req, res, next) => {
    if (req.cookies['token']) {
      var randomTimer1To3Seconds = (Math.floor(Math.random() * 3) + 1) * 1000;
      setTimeout(() => {
        return res.clearCookie('token').redirect('/?loadType=partial');
      }, randomTimer1To3Seconds);
    }
    else {
      return res.redirect('/');
    }

  });

module.exports = router;
