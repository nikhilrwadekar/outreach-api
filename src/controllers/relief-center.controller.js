// Get The Model
const ReliefCenter = require("../models/relief-center.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// UUID for IDs
// const uuidv1 = require("uuid/v1");

// Get All Relief Centers
exports.getAllReliefCenters = async (req, res, next) => {
  try {
    // const reliefCenters = await ReliefCenter.find({}); // Find One by ID
    // res.status(httpStatus.FOUND);
    // res.send(reliefCenters);
    const allReliefCenters = await ReliefCenter.find();
    res.send(allReliefCenters);
  } catch (error) {
    return next(error);
  }
};

// Create Relief Center
exports.createReliefCenter = async (req, res, next) => {
  try {
    // New ID for the Relief Center
    // const reliefCenterID = uuidv1();

    // Details for the Relief Center from the Request (body)
    const body = req.body;

    // Attach UUID to the information before we create the entry in MongoDB
    // body.activationKey = activationKey;
    // Let MongoDB handle it

    // Take the data from Request, Use the Model to create the entry
    const reliefCenter = new ReliefCenter(body);

    // Save the entry into MongoDB
    const savedReliefCenter = await reliefCenter.save();

    // Return with Status of Created
    res.status(httpStatus.CREATED);

    // Send back the data that was just created
    // Use .transform() in case you're dealing with sensitive information, for eg: Passwords
    res.send(savedReliefCenter);
  } catch (error) {
    // Setup a check for Duplicate Name here
    return next(error);
    // return next(ReliefCenter.checkDuplicateEmailError(error));
  }
};

// Get Relief Center
exports.getReliefCenterByID = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from Params

    const reliefCenter = await ReliefCenter.findOne({ id: parseInt(id) }); // Find One by ID
    return res.json(reliefCenter); // Return the Relief Center
  } catch (error) {
    next(error);
  }
};

// Update Relief Center
exports.getReliefCenterByName = async (req, res, next) => {
  try {
    const { name } = req.params; // Get the Name from Params

    const reliefCenter = await ReliefCenter.findOne({ name: name }); // Find One by Name
    return res.json(reliefCenter); // Return the Relief Center
  } catch (error) {
    next(error);
  }
};

// Delete Relief Center
exports.deleteReliefCenter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReliefCenter = await ReliefCenter.findOneAndDelete({
      id: parseInt(id)
    });
    res.status(httpStatus.OK);
    return res.json({
      message: "Relief Center was deleted!",
      data: deletedReliefCenter
    });
  } catch (error) {
    next(error);
  }
};
