// Get The Model
const User = require("../models/user.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// POST User
exports.createUser = async (req, res, next) => {
  try {
    // New ID for the User
    // const userID = uuidv1();

    // Details for the User from the Request (body)
    const body = req.body;

    // Attach UUID to the information before we create the entry in MongoDB
    // body.activationKey = activationKey;
    // Let MongoDB handle it

    // Take the data from Request, Use the Model to create the entry
    const user = new User(body);

    // Save the entry into MongoDB
    const savedUser = await user.save();

    // Return with Status of Created
    res.status(httpStatus.CREATED);

    // Send back the data that was just created
    // Use .transform() in case you're dealing with sensitive information, for eg: Passwords
    res.send(savedUser);
  } catch (error) {
    // Setup a check for Duplicate Email here
    return next(error);
    // return next(User.checkDuplicateEmailError(error));
  }
};

// GET User
exports.getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from Params

    const user = await User.findOne({ id: parseInt(id) }).select("-password"); // Find One by ID
    return res.json(user); // Return the User
  } catch (error) {
    next(error);
  }
};

// POST based on their Email
exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params; // Get the Email from Params

    const user = await User.find({ email: email }).select("-password"); // Find One by Name
    return res.json(user); // Return the User
  } catch (error) {
    next(error);
  }
};

// DELETE User
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findOneAndDelete({
      id: parseInt(id)
    });
    res.status(httpStatus.OK);
    return res.json({
      message: "User was deleted!",
      data: deletedUser
    });
  } catch (error) {
    next(error);
  }
};

// PUT (Update) User
exports.updateUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const udpatedUser = await User.findOneAndUpdate({ _id: id }, req.body);
    res.status(httpStatus.OK);
    return res.json({
      message: "User was updated!"
    });
  } catch (error) {
    next(error);
  }
};
