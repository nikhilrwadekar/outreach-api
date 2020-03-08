"use strict";
const express = require("express");
// Express Router
const router = express.Router();

// Get Routers
const reliefCenterRouter = require("./relief-center");
const userRouter = require("./user");
const disasterRouter = require("./disaster");
const transactionRouter = require("./transaction");

router.use("/relief-center", reliefCenterRouter);
router.use("/user", userRouter);
router.use("/disaster", disasterRouter);
router.use("/transaction", transactionRouter);

module.exports = router;
