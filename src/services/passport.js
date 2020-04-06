const LocalStrategy = require("passport-local").Strategy; // Local Strategy
// const GoogleStrategy = require("passport-google-oauth").OAuthStrategy; // Google Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/user.model");
// Get Config
const config = require("../config");

const { google, facebook } = config.oauth;

module.exports = (passport) => {
  passport.use(
    // Change default username field to 'email'
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then((user) => {
          // Match User Email
          if (!user) {
            return done(null, false, {
              message: "That email is not registered!",
            });
          }
          // Match Hashed Password
          user.comparePassword(password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect." });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: google.appID,
        clientSecret: google.appSecret,
        callbackURL: "http://localhost:4000/api/auth/login/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        // return cb(null, { accessToken, refreshToken, profile, cb });
        const user = await User.findOne({ email: profile._json.email }).select(
          "-password"
        );

        if (!user) {
          // Create the User
          return cb(err, null);
        } else if (user) return cb(null, user);
      }
    )
  );

  // Facebook Strategy
  //   passport.use(new FacebookStrategy({
  //     clientID: FACEBOOK_APP_ID,
  //     clientSecret: FACEBOOK_APP_SECRET,
  //     callbackURL: "http://www.example.com/auth/facebook/callback"
  //   },
  //   function(accessToken, refreshToken, profile, done) {
  //     User.findOrCreate({}, function(err, user) {
  //       if (err) { return done(err); }
  //       done(null, user);
  //     });
  //   }
  // ));

  // Serialize User
  passport.serializeUser((user, done) => {
    console.log("Serializing...");
    done(null, user.id);
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    console.log("DeSerializing...");
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
