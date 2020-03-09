"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// User Controller and Validators
const userController = require("../../controllers/user.controller");
// const { createUser } = require("../../validators/user");

// Routes for Users

// POST New User - Check if it exists based on it's name
router.post("/create", userController.createUser);

// Get a User based on their ID
router.get("/id/:id", userController.getUserByID);

// Get a User based on their email
router.get("/:email", userController.getUserByEmail);

// UPDATE User
router.put("/id/:id", userController.updateUserByID);

// PUT a request to a volunteer - for a task - to a relief center
router.put(
  "/id/:userID/volunteer/:taskID",
  userController.sendVolunteerRequest
);

module.exports = router;
