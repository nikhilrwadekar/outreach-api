"use strict";

const config = require("../config");
const mongoose = require("mongoose");

mongoose.Promise = require("bluebird");

// Successful Connection to MongoDB
mongoose.connection.on("connected", () => {
  console.log("MongoDB is connected!");
});

// Error on trying to connect to MongoDB
mongoose.connection.on("error", err => {
  console.log(`Could not connect to MongoDB because of ${err}`);
  process.exit(1);
});

// Debug if it's the DEV environment
if (config.env === "dev") {
  mongoose.set("debug", true);
}

exports.connect = () => {
  var mongoURI =
    config.env === "prod" || "dev" ? config.mongo.uri : config.mongo.testURI;

  mongoose.connect(mongoURI, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  mongoose.set("useCreateIndex", true);

  return mongoose.connection;
};
