"use strict";
const express = require("express");
// Express Router
const router = express.Router();

// Get Router for Relief Centers
const reliefCenterRouter = require("./relief-center");

router.use("/relief-center", reliefCenterRouter);

module.exports = router;
