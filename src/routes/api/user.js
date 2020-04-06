"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Config File
const config = require("../../config");

// User Controller and Validators
const userController = require("../../controllers/user.controller");
// Auth Controller - for token Validation
const authController = require("../../controllers/auth.controller");

// API Verification Middleware
const verifyApiKey = (req, res, next) => {
  const { api_key } = req.query;
  if (api_key == config.apiKey) next();
  else res.sendStatus(403);
};

// UPDATE User
router.put(
  "/id/:id",
  authController.authenticateToken,
  userController.updateUserByID
);

// USER Routes END (Common)

// ADMIN Routes START
// Suggest all volunteers
router.get(
  "/suggest/",
  authController.authenticateToken,
  userController.suggestVolunteers
);

// Suggest Volunteers for a Task
router.get(
  "/suggest/task/:taskID",
  authController.authenticateToken,
  userController.suggestVolunteersForTask
);

// Suggest Volunteers for a Task
router.get(
  "/suggest/relief-center/:reliefCenterID",
  authController.authenticateToken,
  userController.suggestVolunteersForReliefCenter
);

router.post(
  "/admin/request/:email/:taskID",
  authController.authenticateToken,
  userController.requestUserToVolunteerForTask
);

router.get(
  "/admin/requests/received",
  authController.authenticateToken,
  userController.getAllRequestsFromVolunteers
);

// Get a User based on their ID
router.get(
  "/id/:id",
  authController.authenticateToken,
  userController.getUserByID
);

// ADMIN Routes END

// VOLUNTEER Routes START
// Get All Opportunities
router.get(
  "/opportunities",
  authController.authenticateToken,
  userController.getAllOpportunities
);

// Send a request to Admin to volunteer
router.put(
  "/id/:email/volunteer/:taskID",
  authController.authenticateToken,
  userController.sendVolunteerRequest
);

// Get a USER's assigned tasks by Email!
router.get(
  "/:email/tasks/",
  authController.authenticateToken,
  userController.getAssignedOpportunitiesByUserEmail
);

// Get sent requests by User's Email!
router.get(
  "/:email/requests/sent",
  authController.authenticateToken,
  userController.getRequestedOpportunitiesByUserEmail
);

// Get received requests (from Admin) by User's Email!
router.get(
  "/:email/requests/received",
  authController.authenticateToken,
  userController.getReceivedOpportunitiesByUserEmail
);

// Opt out from task.
router.post(
  "/:email/optout/:taskID",
  authController.authenticateToken,
  userController.optOutFromTask
);

// Opt in to a task - Accept Admin's Request
router.post(
  "/:email/optin/:taskID",
  authController.authenticateToken,
  userController.optInToTask
);

// Opt in to a task - Decline Admin's Request
router.post(
  "/:email/decline/:taskID",
  authController.authenticateToken,
  userController.declineTask
);

// VOLUNTEER Routes END

// USER Routes (Common)
// POST New User - Check if it exists based on it's EMAIL
router.post("/create", verifyApiKey, userController.createUser);

// Get a User based on their email
router.get("/:email", verifyApiKey, userController.getUserByEmail);

module.exports = router;
