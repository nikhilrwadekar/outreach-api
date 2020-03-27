"use strict";

// Get the ENV file
require("dotenv").config();

const config = require("../config");
const express = require("express");
const cors = require("cors");
// const errorHandler = require("../middlewares/error-handler");
const apiRouter = require("../routes/api");
const session = require("express-session");
const passport = require("passport");
// const passportJwt = require("../services/passport");
const helmet = require("helmet");
const app = express();

// Passport Config
require("../services/passport")(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Body Parser
app.use(cors());
app.use(helmet());

// FFS: Cookies!
// The correct way (yet) to store the user data on the client side.
// Passport will serialize it into a cookie (Meaning it will be encrypted into a cookie)
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Check if request is Authenticated
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("Auth");
    next();
  } else {
    console.log("Not Auth");
    next();
  }
});

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
