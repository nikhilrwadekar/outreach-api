// Get The Model
const Notification = require("../models/notification.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// Get All Volunteering Types
exports.getAllNotificationsForUser = async (req, res, next) => {
  try {
    const { email } = req.params;

    const allUserNofitications = await Notification.find({
      email: email
    }).sort({ createdAt: -1 });
    res.send(allUserNofitications);
  } catch (error) {
    return next(error);
  }
};
