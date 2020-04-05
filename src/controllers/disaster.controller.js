// Get The Model
const Disaster = require("../models/disaster.model");
const Transaction = require("../models/transaction.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// UUID for IDs
// const uuidv1 = require("uuid/v1");

// Get All Disasters
exports.getAllDisasters = async (req, res, next) => {
  try {
    //User can be accessed here as we are authenticating it!
    const allDisasters = await Disaster.find();
    res.send(allDisasters);
  } catch (error) {
    return next(error);
  }
};

// Create Disaster
exports.createDisaster = async (req, res, next) => {
  try {
    // Details for the Disaster from the Request (body)
    const body = req.body;

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

    const disaster = await Disaster.findOne({ _id: id }); // Find One by ID
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
      id: parseInt(id),
    });
    res.status(httpStatus.OK);
    return res.json({
      message: "Disaster was deleted!",
      data: deletedDisaster,
    });
  } catch (error) {
    next(error);
  }
};

// Donate to a Disaster
exports.donateToDisasterByID = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Create a new transaction, based on the donation
    const newTransaction = Transaction(req.body);

    // Users.findOneAndUpdate({name: req.user.name}, {$push: {friends: friend}});
    const disasterDonation = await Disaster.findOneAndUpdate(
      { _id: id },
      { $push: { donations: newTransaction } }
    );

    const savedTransaction = await newTransaction.save();

    res.status(httpStatus.OK);
    return res.json({
      message: `Donation was successful to ${disasterDonation.name}!`,
      data: savedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get Total Donated to a Disaster based on Grouped by Currency
exports.getTotalDonatedByID = async (req, res, next) => {
  var pipeline = [
    {
      $group: {
        currency: "$currency",
        total: { $sum: "$amount" },
      },
    },
  ];
  Disaster.aggregate(pipeline, function (err, results) {
    if (err) throw err;
    console.log(results);
  });
};
