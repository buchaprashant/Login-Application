var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var Users = require('./models/users');
var config = require('./config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey);
};

var opts = {};
//opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, next) => {
        var user = Users.find(element => element.id == jwt_payload.id);
        if (user) {
            return next(null, user);
        }
        else {
            return next(null, false);
        }

    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

function cookieExtractor(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};