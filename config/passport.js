const jwtStrategy = require("passport-jwt").Strategy;
const jwtExtract = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const userM = require("../model/User");
const key = require("../config/key");

const opts = {};

opts.jwtFromRequest = jwtExtract.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.secretKey;

module.exports = passport => {
  passport.use(
    new jwtStrategy(opts, (jwt_payload, done) => {
      userM
        .findById({ _id: jwt_payload.id })
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => {
          console.log(err);
          return done(null, false);
        });
    })
  );
};
