"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// User Controller and Validators
const userController = require("../../controllers/user.controller");
// const { createUser } = require("../../validators/user");

// Routes for Users

// Get all Users
router.get("/", userController.getAllUsers);

// Create New User - Check if it exists based on it's name
router.post(
  "/create",

  userController.createUser
);

router.get("/id/:id", userController.getUserByID); // Get a User based on it's ID
router.get("/:name", userController.getUserByName); // Get a User based on it's name

module.exports = router;
