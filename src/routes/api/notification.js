"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Transaction Controller and Validators
const notificationController = require("../../controllers/notification.controller");

// Routes for Notfications

// Get all Notfications
router.get(
  "/volunteer/:email",
  notificationController.getAllNotificationsForUser
);

// Get all Notfications - Admin
router.get("/admin", notificationController.getAllAdminNotifications);

// Get a Transaction based on it's ID
// router.get("/id/:id", notificationController.getTransactionByID);

// Delete a Transaction
// router.delete("/id/:id", notificationController.deleteTransactionByID);

module.exports = router;
