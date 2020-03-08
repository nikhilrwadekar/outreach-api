"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Transaction Controller and Validators
const transactionController = require("../../controllers/transaction.controller");
// const { createTransaction } = require("../../validators/transaction");

// Routes for Transactions

// Get all Transactions
router.get("/", transactionController.getAllTransactions);

// Get all Transactions - Grouped
router.get("/currency", transactionController.getTotalDonated);

// Get a Transaction based on it's ID
router.get("/id/:id", transactionController.getTransactionByID);

// Delete a Transaction
router.delete("/id/:id", transactionController.deleteTransactionByID);

module.exports = router;
