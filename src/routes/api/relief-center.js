"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Relief Center Controller and Validators
const reliefCenterController = require("../../controllers/relief-center.controller");
const { createReliefCenter } = require("../../validators/relief-center");

// Routes for Relief Centers

// Get all Relief Centers
router.get("/", reliefCenterController.getAllReliefCenters);

// Create New Relief Center - Check if it exists based on it's name
router.post("/create", reliefCenterController.createReliefCenter);

// Get a Relief Center based on it's ID
router.get("/id/:id", reliefCenterController.getReliefCenterByID);

// Get a Relief Center based on it's name
router.get("/:name", reliefCenterController.getReliefCenterByName);

// UPDATE Relief Center
router.put("/id/:id", reliefCenterController.updateReliefCenterByID);

// Approve Volunteer Request!
router.post(
  "/id/:taskID/:emailID",
  reliefCenterController.approveVolunteerRequest
);

// Decline Volunteer Request!
router.post(
  "/id/:taskID/:emailID/decline",
  reliefCenterController.declineVolunteerRequest
);

// Get Task Categorized and Total Count!
router.get(
  "/all/requirement",
  reliefCenterController.getReliefCenterRequirements
);

// Get Task Categorized and Total Count!
router.get(
  "/id/:reliefCenterID/requirement",
  reliefCenterController.getReliefCenterRequirementsByID
);
module.exports = router;
