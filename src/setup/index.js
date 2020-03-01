const mongoose = require("mongoose");
const reliefCenterModel = require("../models/relief-center.model");

reliefCenterModel.createCollection().then(function(collection) {
  console.log("Relief Center Collection is created!");
});
