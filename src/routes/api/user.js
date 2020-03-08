"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// User Controller and Validators
const userController = require("../../controllers/user.controller");
// const { createUser } = require("../../validators/user");

// Routes for Users

// Create New User - Check if it exists based on it's name
router.post(
  "/create",

  userController.createUser
);

router.get("/id/:id", userController.getUserByID); // Get a User based on their ID
router.get("/:email", userController.getUserByEmail); // Get a User based on their email

module.exports = router;
