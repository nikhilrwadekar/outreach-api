"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Get the Auth Controller
const authController = require("../../controllers/auth.controller");

// JWT
const jwt = require("jsonwebtoken");

// Login User
router.post("/login", authController.login);

// Token Refresh/Generator
router.post("/token", authController.generateAccessTokenWithRefreshToken);

//Logout User - Remove the refresh token from the DB
// router.delete("/logout");
module.exports = router;
