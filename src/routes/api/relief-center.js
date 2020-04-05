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

// UPDATE Relief Center
router.put("/:id/tasks/add", reliefCenterController.addTasksToReliefCenter);

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

// Get Task Categorized and Total Count! (Relief Center Cards)
router.get(
  "/id/:reliefCenterID/requirement",
  reliefCenterController.getReliefCenterRequirementsByID
);

// Get Tasks for Assigning Volunteers! (Relief Center Assign Page)
router.get(
  "/id/:reliefCenterID/requirement/assign",
  reliefCenterController.getReliefCenterTasksByID
);

// Get Assigned or Request Sent or Request Received by Volunteers for a Task
router.get(
  "/task/:taskID/:volunteersListType",
  reliefCenterController.getAssignedVolunteersByTaskID
);

module.exports = router;
