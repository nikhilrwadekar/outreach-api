"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// User Controller and Validators
const userController = require("../../controllers/user.controller");
// const { createUser } = require("../../validators/user");

// Suggest all volunteers
router.get("/suggest/", userController.suggestVolunteers);

// Suggest Volunteers for a Task
router.get("/suggest/task/:taskID", userController.suggestVolunteersForTask);

// Suggest Volunteers for a Task
router.get(
  "/suggest/relief-center/:reliefCenterID",
  userController.suggestVolunteersForReliefCenter
);

// Get All Opportunities
router.get("/opportunities", userController.getAllOpportunities);

// Routes for Users

/* ========== ADMIN ROUTES ========== */
router.post(
  "/admin/request/:email/:taskID",
  userController.requestUserToVolunteerForTask
);

router.get(
  "/admin/requests/received",
  userController.getAllRequestsFromVolunteers
);

// POST New User - Check if it exists based on it's name
router.post("/create", userController.createUser);

// Get a User based on their ID
router.get("/id/:id", userController.getUserByID);

// Get a User based on their email
router.get("/:email", userController.getUserByEmail);

// UPDATE User
router.put("/id/:id", userController.updateUserByID);

// PUT a request to a volunteer - for a task - to a relief center
router.put("/id/:email/volunteer/:taskID", userController.sendVolunteerRequest);

// Get a USER's assigned tasks by Email!
router.get(
  "/:email/tasks/",
  userController.getAssignedOpportunitiesByUserEmail
);

// Get sent requests by User's Email!
router.get(
  "/:email/requests/sent",
  userController.getRequestedOpportunitiesByUserEmail
);

// Get received requests (from Admin) by User's Email!
router.get(
  "/:email/requests/received",
  userController.getReceivedOpportunitiesByUserEmail
);

// Opt out from task.
router.post("/:email/optout/:taskID", userController.optOutFromTask);

// Opt in to a task - Accept Admin's Request
router.post("/:email/optin/:taskID", userController.optInToTask);

// Opt in to a task - Accept Admin's Request
router.post("/:email/decline/:taskID", userController.declineTask);

module.exports = router;
