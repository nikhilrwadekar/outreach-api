// Get The Model
const ReliefCenter = require("../models/relief-center.model");

// Get Config
const config = require("../config");

// HTTP Status
const httpStatus = require("http-status");

// UUID for IDs
const uuidv1 = require("uuid/v1");

// Create Relief Center
exports.createReliefCenter = async (req, res, next) => {
  try {
    // New ID for the Relief Center
    const activationKey = uuidv1();

    // Details for the Relief Center from the Request (body)
    const body = req.body;

    // Attach UUID to the information before we create the entry in MongoDB
    // body.activationKey = activationKey;
    // Let MongoDB handle it

    // Take the data from Request, Use the Model to create the entry
    const user = new ReliefCenter(body);

    // Save the entry into MongoDB
    const savedReliefCenter = await user.save();

    // Return with Status of Created
    res.status(httpStatus.CREATED);

    // Send back the data that was just created
    res.send(savedReliefCenter.transform());
  } catch (error) {
    return next(ReliefCenter.checkDuplicateEmailError(error));
  }
};

// Get Relief Center
exports.getReliefCenter = async (req, res, next) => {
  try {
    const user = await ReliefCenter.findOne(req.body);
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.secret);
    return res.json({ message: "OK", token: token });
  } catch (error) {
    next(error);
  }
};

// Update Relief Center
exports.updateReliefCenter = async (req, res, next) => {
  try {
    await ReliefCenter
      .findOneAndUpdate
      // Fields to update go here

      // { activationKey: req.query.key },
      // { active: true }
      ();
    return res.json({ message: "Relief Center was updated!" });
  } catch (error) {
    next(error);
  }
};

// Delete Relief Center
exports.deleteReliefCenter = async (req, res, next) => {
  try {
    await ReliefCenter
      .findOneAndDelete
      // Fields to update go here

      // { activationKey: req.query.key },
      // { active: true }
      ();
    return res.json({ message: "Relief Center was deleted!" });
  } catch (error) {
    next(error);
  }
};
