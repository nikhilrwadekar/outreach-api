"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const validator = require("express-validation");

// Get the Auth Controller
const authController = require("../../controllers/auth.controller");

// Token Model
const Token = require("../../models/refresh-token.model");

// Passport
const passport = require("passport");

// Generate Token Function
const generateAccessToken = (issuerInformation) =>
  jwt.sign(issuerInformation, process.env.ACCESS_TOKEN_SECRET);

router.get("/logout", function (req, res) {
  req.logOut();
  req.session.destroy(function (err) {
    if (!err) {
      res
        .status(200)
        .clearCookie("connect.sid", { path: "/" })
        .json({ status: "Success" });
    } else {
      // handle error case...
    }
  });
});

// Google Auth
router.post("/login/google", authController.verifyGoogleAccessToken);

// Google Callback
router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/disaster/",
    failureRedirect: "/api/auth/login/google",
  }),
  async (req, res, next) => {
    res.send(req.user);
  }
);

// Redirect the user back to the app
router.get("/login/google/redirect", async (req, res, next) => {
  // you can see what you get back from LinkedIn here:
  console.log(req.user);
  res.redirect("exp://10.0.0.11:19000/?" + JSON.stringify(req.user));
});

// Login Route
router.post("/login", passport.authenticate("local"), async function (
  req,
  res
) {
  // If called, get user from req.user (It means, Auth succeeded)
  // Send back User, Access Token, Refresh Token.
  const user = req.user;

  // User Email
  const { email, name, role } = user;

  let accessToken = null;

  // Find a Refresh Token for the user
  await Token.findOne({ email: email }, (tokenNotFound, tokenFoundInDB) => {
    if (tokenNotFound) {
      res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    // If all good, proceed to verify and send a new access tokenFoundInDB back!
    if (tokenFoundInDB) {
      jwt.verify(
        tokenFoundInDB.token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.sendStatus(403);

          // Generate Access Token
          accessToken = generateAccessToken({
            iss: "outreach",
            name: name,
            admin: role == "admin",
          });
        }
      );
    }
  });

  res.sendStatus(403);

  // Send back the info
  if (!!accessToken && !!refreshToken)
    res.status(200).json({
      address: user.address,
      availability: user.availability,
      type: user.type,
      profile_picture_url: user.profile_picture_url,
      role: user.role,
      _id: user._id,
      name: user.name,
      email: user.email,
      contact_number: user.contact_number,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
});

// Facebook Callback
router.post("/login/facebook", passport.authenticate("facebook"));

// Token Refresh/Generator
router.post("/token", authController.generateAccessTokenWithRefreshToken);

//Logout User - Remove the refresh token from the DB
// router.delete("/logout");

module.exports = router;
