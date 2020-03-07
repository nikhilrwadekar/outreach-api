"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Disaster Controller and Validators
const disasterController = require("../../controllers/disaster.controller");
// const { createDisaster } = require("../../validators/disaster");

// Routes for Disasters

// Get all Disasters
router.get("/", disasterController.getAllDisasters);

// Create New Disaster - Check if it exists based on it's name
router.post(
  "/create",

  disasterController.createDisaster
);

router.get("/id/:id", disasterController.getDisasterByID); // Get a Disaster based on it's ID
router.get("/:name", disasterController.getDisasterByName); // Get a Disaster based on it's name

module.exports = router;
