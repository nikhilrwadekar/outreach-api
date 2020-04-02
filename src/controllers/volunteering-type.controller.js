// Get The Model
const VolunteeringType = require("../models/volunteering-type.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// Get All Volunteering Types
exports.getAllVolunteeringTypes = async (req, res, next) => {
  try {
    const allVolunteeringTypes = await VolunteeringType.find();
    res.send(allVolunteeringTypes);
  } catch (error) {
    return next(error);
  }
};
