"use strict";
const express = require("express");
// Express Router
const router = express.Router();

// Auth Controller - for token Validation
const authController = require("../../controllers/auth.controller");

// Get Routers
const reliefCenterRouter = require("./relief-center");
const userRouter = require("./user");
const disasterRouter = require("./disaster");
const transactionRouter = require("./transaction");
const authRouter = require("./auth");
const volunteeringTypeRouter = require("./volunteering-type");
const notificationRouter = require("./notification");

// Open for getting a token
router.use("/auth", authRouter); // Has the Login Route
router.use("/user", userRouter); // Has the Create Account Route
router.use("/disaster", disasterRouter); // Open for Anonymous Donations
router.use("/volunteering-type", volunteeringTypeRouter); // Needed for signing up

// These routes need a token to be accessed
router.use(
  "/relief-center",
  authController.authenticateToken,
  reliefCenterRouter
);
router.use("/transaction", authController.authenticateToken, transactionRouter);

router.use(
  "/notification",
  authController.authenticateToken,
  notificationRouter
);

module.exports = router;
