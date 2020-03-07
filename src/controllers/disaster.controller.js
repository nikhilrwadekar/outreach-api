// Get The Model
const Disaster = require("../models/disaster.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// UUID for IDs
const uuidv1 = require("uuid/v1");

// Get All Disasters
exports.getAllDisasters = async (req, res, next) => {
  try {
    // const disasters = await Disaster.find({}); // Find One by ID
    // res.status(httpStatus.FOUND);
    // res.send(disasters);
    const allDisasters = await Disaster.find();
    res.send(allDisasters);
  } catch (error) {
    return next(error);
  }
};

// Create Disaster
exports.createDisaster = async (req, res, next) => {
  try {
    // New ID for the Disaster
    const disasterID = uuidv1();

    // Details for the Disaster from the Request (body)
    const body = req.body;

    // Attach UUID to the information before we create the entry in MongoDB
    // body.activationKey = activationKey;
    // Let MongoDB handle it

    // Take the data from Request, Use the Model to create the entry
    const disaster = new Disaster(body);

    // Save the entry into MongoDB
    const savedDisaster = await disaster.save();

    // Return with Status of Created
    res.status(httpStatus.CREATED);

    // Send back the data that was just created
    // Use .transform() in case you're dealing with sensitive information, for eg: Passwords
    res.send(savedDisaster);
  } catch (error) {
    // Setup a check for Duplicate Name here
    return next(error);
    // return next(Disaster.checkDuplicateEmailError(error));
  }
};

// Get Disaster
exports.getDisasterByID = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from Params

    const disaster = await Disaster.findOne({ id: parseInt(id) }); // Find One by ID
    return res.json(disaster); // Return the Disaster
  } catch (error) {
    next(error);
  }
};

// Update Disaster
exports.getDisasterByName = async (req, res, next) => {
  try {
    const { name } = req.params; // Get the Name from Params

    const disaster = await Disaster.findOne({ name: name }); // Find One by Name
    return res.json(disaster); // Return the Disaster
  } catch (error) {
    next(error);
  }
};

// Delete Disaster
exports.deleteDisaster = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedDisaster = await Disaster.findOneAndDelete({
      id: parseInt(id)
    });
    res.status(httpStatus.OK);
    return res.json({
      message: "Disaster was deleted!",
      data: deletedDisaster
    });
  } catch (error) {
    next(error);
  }
};
