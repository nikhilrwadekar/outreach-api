"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Disaster Controller and Validators
const disasterController = require("../../controllers/disaster.controller");
// const { createDisaster } = require("../../validators/disaster");

// Token Authenticator
const authController = require("../../controllers/auth.controller");

// Routes for Disasters

// Get all Disasters
router.get(
  "/",
  authController.authenticateToken,
  disasterController.getAllDisasters
);

// Create New Disaster - Check if it exists based on it's name
router.post(
  "/create",

  disasterController.createDisaster
);

router.get("/id/:id", disasterController.getDisasterByID); // Get a Disaster based on it's ID
router.get("/:name", disasterController.getDisasterByName); // Get a Disaster based on it's name

// Donate to a disaster
router.post("/donate/:id", disasterController.donateToDisasterByID); //Donate towards a Disaster

module.exports = router;
