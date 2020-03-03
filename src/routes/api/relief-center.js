"use strict";

// Express App, Router, and Validator
const express = require("express");
const router = express.Router();
const validator = require("express-validation");

// Relief Center Controller and Validators
const reliefCenterController = require("../../controllers/relief-center.controller");
const { create } = require("../../validators/relief-center");

// Routes for Relief Centers
router.get("/", reliefCenterController.getAllReliefCenters);
router.post(
  "/create",
  validator(create),
  reliefCenterController.createReliefCenter
); // Create New Relief Center - Check if it exists based on it's name
router.get("/id/:id", reliefCenterController.getReliefCenterByID); // Get a Relief Center based on it's ID
router.get("/name/:name", reliefCenterController.getReliefCenterByName); // Get a Relief Center based on it's name

module.exports = router;
