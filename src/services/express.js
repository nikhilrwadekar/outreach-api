"use strict";

// Get the ENV file
require("dotenv").config();

const config = require("../config");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const errorHandler = require("../middlewares/error-handler");
const apiRouter = require("../routes/api");
// const session = require("express-session");
const passport = require("passport");
const passportJwt = require("../services/passport");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

// passport
app.use(passport.initialize());
passport.use("jwt", passportJwt.jwt);

// API Routes
app.use("/api", apiRouter);
// app.use(errorHandler.handleNotFound);
// app.use(errorHandler.handleError);

// Start Server
exports.start = () => {
  app.listen(config.port, err => {
    if (err) {
      console.log(`Error: ${err}`);
      // -1 for
      process.exit(-1);
    }

    console.log(`${config.app} is running on ${config.port}`);
  });
};
