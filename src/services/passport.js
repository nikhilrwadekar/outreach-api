const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user.model");

module.exports = passport => {
  passport.use(
    // Change default username field to 'email'
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match User
      User.findOne({ email: email })
        .then(user => {
          // Match User Email
          if (!user) {
            return done(null, false, {
              message: "That email is not registered!"
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
        .catch(err => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing...");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("DeSerializing...");
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
