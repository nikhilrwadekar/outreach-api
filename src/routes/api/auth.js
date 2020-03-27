"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
// const validator = require("express-validation");

// Get the Auth Controller
const authController = require("../../controllers/auth.controller");

// Passport
const passport = require("passport");

// Login User
// router.post("/login", authController.login); //OLD

router.post("/login", passport.authenticate("local"), function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.send(req.user);
});

router.post("/login", passport.authenticate(), (req, res) => {
  res.send("Authenticated by passport");
});

// Token Refresh/Generator
router.post("/token", authController.generateAccessTokenWithRefreshToken);

//Logout User - Remove the refresh token from the DB
// router.delete("/logout");

module.exports = router;
