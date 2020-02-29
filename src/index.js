//For example: Strict mode doesn't allow usage of undeclared variables
"use strict";

const mongoose = require("./services/mongoose");
const app = require("./services/express");

app.start();
mongoose.connect();

module.exports = app;
