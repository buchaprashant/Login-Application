var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  //if user is already logged in, redirect to his profile
  if (req.cookies['token']) {
    return res.redirect('/users/profile');
  }
  if (req.query.loadType == 'partial') {
    res
      .append('loginStatus', 'Not Logged In')
      .render('home');
  }
  else {
    res.render('index', {
      'loginStatus': 'Not Logged In',
      'page': 'home'
    });
  }
});

module.exports = router;
