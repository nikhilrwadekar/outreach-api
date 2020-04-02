"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Transaction Controller and Validators
const notificationController = require("../../controllers/notification.controller");
// const { createTransaction } = require("../../validators/transaction");

// Routes for Transactions

// Get all Transactions
router.get("/:email", notificationController.getAllNotificationsForUser);

// Get all Transactions - Grouped
// router.get("/currency", notificationController.getTotalDonated);

// Get a Transaction based on it's ID
// router.get("/id/:id", notificationController.getTransactionByID);

// Delete a Transaction
// router.delete("/id/:id", notificationController.deleteTransactionByID);

module.exports = router;
