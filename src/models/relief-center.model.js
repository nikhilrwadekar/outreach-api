const mongoose = require("mongoose"); // Erase if already required

// Schema for Volunteers for a given Relief Center
const opportunitySchema = new mongoose.Schema({
  type: String,
  date: Date,
  time: {
    start: String,
    end: String
  },
  required: Number,
  assigned: [String],
  requests: {
    sent: [String],
    received: [String]
  }
});

// Declare the Schema for Relief Centers of the Mongo model
const reliefCenterSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true
  },
  description: {
    type: "String",
    required: true
  },
  picture_url: {
    type: "String",
    required: true
  },
  location: {
    type: "String",
    required: true
  },
  volunteers: {
    opportunities: {
      type: [opportunitySchema]
    }
  }
});

//Export the model
module.exports = mongoose.model("ReliefCenter", reliefCenterSchema);
