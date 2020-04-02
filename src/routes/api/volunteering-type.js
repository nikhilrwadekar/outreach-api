"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Transaction Controller and Validators
const volunteeringTypeController = require("../../controllers/volunteering-type.controller");
// const { createTransaction } = require("../../validators/transaction");

// Routes for Transactions

// Get all Transactions
router.get("/", volunteeringTypeController.getAllVolunteeringTypes);

// Get all Transactions - Grouped
// router.get("/currency", volunteeringTypeController.getTotalDonated);

// Get a Transaction based on it's ID
// router.get("/id/:id", volunteeringTypeController.getTransactionByID);

// Delete a Transaction
// router.delete("/id/:id", volunteeringTypeController.deleteTransactionByID);

module.exports = router;
