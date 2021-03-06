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

// Google Auth
router.post("/login/google", authController.verifyGoogleAccessToken);

// Facebook Auth
router.post("/login/facebook", authController.verifyFacebookAccessToken);

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

  // Find a Refresh Token for the user, Create a new Access Token with it, send it all back!
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

    // Send back the info
    if (!!accessToken && !!tokenFoundInDB.token)
      res.status(200).json({
        address: user.address,
        availability: user.availability,
        type: user.type,
        profile_picture_url: user.profile_picture_url,
        preferences: user.preferences,
        role: user.role,
        _id: user._id,
        name: user.name,
        email: user.email,
        contact_number: user.contact_number,
        accessToken: accessToken,
        refreshToken: tokenFoundInDB.token,
      });
  });
});

// Token Refresh/Generator
router.post("/token", authController.generateAccessTokenWithRefreshToken);

module.exports = router;
