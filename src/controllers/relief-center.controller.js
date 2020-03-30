// Mongoose
const mongoose = require("mongoose");

// Get The Model
const ReliefCenter = require("../models/relief-center.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

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

    const reliefCenter = await ReliefCenter.findOne({ _id: id }); // Find One by ID
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

// PUT (Update) Relief Center
exports.updateReliefCenterByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const udpatedReliefCenter = await ReliefCenter.findOneAndUpdate(
      { _id: id },
      req.body
    );
    res.status(httpStatus.OK);
    return res.json({
      message: "Relief Center was updated!"
    });
  } catch (error) {
    next(error);
  }
};

// Approve Volunteer Request
exports.approveVolunteerRequest = async (req, res, next) => {
  // Get Task ID and Email ID from the request!
  const { taskID, emailID } = req.params;

  // Find Relief Center that has the task with taskID
  await ReliefCenter.findOne(
    { "volunteers.opportunities._id": taskID },
    async function(err, reliefCenter) {
      if (err) next(err);

      // If Relief Center is found..
      if (reliefCenter) {
        // Get the concerned Task from the Relief Center
        let task = await reliefCenter.volunteers.opportunities.id(taskID);

        // Add User's Request - if it hasnt been added already
        if (task.requests.received.includes(emailID)) {
          // Push User's Email to the assigned array
          task.assigned.push(emailID);

          // Remove User's Email from requests.
          task.requests.received.pull(emailID);

          // Save Relief Center!
          reliefCenter.save();

          res.status(httpStatus.OK);
          res.json({ message: "Request has been approved!" });
        } else {
          // TODO: Add Status Code to indicate that the request cannot be completed.
          res.json({ message: "Request could not be approved!" });
        }
      } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({
          message: "Requested task was not found in any Relief Center!"
        });
      }
    }
  );
};

exports.declineVolunteerRequest = async (req, res, next) => {
  // Get Task ID and Email ID from the request!
  const { taskID, emailID } = req.params;

  // Find Relief Center that has the task with taskID
  await ReliefCenter.findOne(
    { "volunteers.opportunities._id": taskID },
    async function(err, reliefCenter) {
      if (err) next(err);

      // If Relief Center is found..
      if (reliefCenter) {
        // Get the concerned Task from the Relief Center
        let task = await reliefCenter.volunteers.opportunities.id(taskID);

        // Add User's Request - if it hasnt been added already
        if (task.requests.received.includes(emailID)) {
          // Remove User's Email from requests. (Decline Request)
          task.requests.received.pull(emailID);

          // Save Relief Center!
          reliefCenter.save();

          res.status(httpStatus.OK);
          res.json({ message: "Request has been declined!" });
        } else {
          // TODO: Add Status Code to indicate that the request cannot be completed.
          res.json({
            message: "Request could not be declined! Does not exist"
          });
        }
      } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({
          message: "Requested task was not found in any Relief Center!"
        });
      }
    }
  );
};

// Get Requirements for Relief Center (Summed Up Count)
exports.getReliefCenterRequirements = async (req, res, next) => {
  try {
    let reliefCenterRequirements = await ReliefCenter.aggregate([
      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },

      // Project each as: Relief Center ID, Name, Type (Job), Number Required, Updated At
      {
        $project: {
          task_id: "$volunteers.opportunities._id",
          relief_center_id: "$_id",
          name: 1,
          type: "$volunteers.opportunities.type",
          assigned: { $size: "$volunteers.opportunities.assigned" },
          volunteer_requests: {
            $size: "$volunteers.opportunities.requests.received"
          },
          admin_requests: { $size: "$volunteers.opportunities.requests.sent" },
          required: "$volunteers.opportunities.required",
          updatedAt: "$updatedAt",
          createdAt: "$createdAt"
        }
      },

      {
        $group: {
          _id: {
            name: "$name",
            type: "$type"
          },
          required: { $sum: "$required" },
          assigned: { $sum: "$assigned" },
          volunteer_requests: { $sum: "$volunteer_requests" },
          admin_requests: { $sum: "$admin_requests" },
          relief_center_id: { $first: "$relief_center_id" },
          updatedAt: { $first: "$updatedAt" },
          createdAt: { $first: "$createdAt" }
        }
      },

      {
        $project: {
          _id: 1,
          name: "$_id.name",
          type: "$_id.type",
          required: 1,
          assigned: 1,
          volunteer_requests: 1,
          admin_requests: 1,
          relief_center_id: 1,
          updatedAt: "$updatedAt",
          createdAt: "$createdAt"
        }
      },
      {
        $group: {
          _id: "$relief_center_id",
          name: { $first: "$name" },
          updatedAt: { $first: "$updatedAt" },
          createdAt: { $first: "$createdAt" },
          required: {
            $push: {
              type: "$type",
              total_capacity: "$required",
              assigned: "$assigned",
              volunteer_requests: "$volunteer_requests",
              admin_requests: "$admin_requests"
            }
          }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json(reliefCenterRequirements);
  } catch (error) {
    next(error);
  }
};

// Get Tasks for a Relief Center
exports.getReliefCenterTasksByID = async (req, res, next) => {
  try {
    let reliefCenterRequirements = await ReliefCenter.aggregate([
      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },

      // Project each as: Relief Center ID, Name, Type (Job), Number Required, Updated At
      {
        $project: {
          task_id: "$volunteers.opportunities._id",
          relief_center_id: "$_id",
          name: 1,
          type: "$volunteers.opportunities.type",
          assigned_total: { $size: "$volunteers.opportunities.assigned" },
          volunteer_requests_total: {
            $size: "$volunteers.opportunities.requests.received"
          },
          requests_sent_by_admin_total: {
            $size: "$volunteers.opportunities.requests.sent"
          },
          total_capacity: "$volunteers.opportunities.required",

          assigned: "$volunteers.opportunities.assigned",
          volunteer_requests: "$volunteers.opportunities.requests.received",
          requests_sent_by_admin: "$volunteers.opportunities.requests.sent",
          date: "$volunteers.opportunities.date",
          start_time: "$volunteers.opportunities.time.start",
          end_time: "$volunteers.opportunities.time.end",
          updatedAt: "$updatedAt",
          createdAt: "$createdAt"
        }
      },

      { $sort: { _id: -1 } }
    ]);

    res.json(reliefCenterRequirements);
  } catch (error) {
    next(error);
  }
};

exports.getReliefCenterRequirementsByID = async (req, res, next) => {
  const { reliefCenterID } = req.params;

  try {
    let reliefCenterRequirements = await ReliefCenter.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(reliefCenterID) } },
      { $unwind: "$volunteers.opportunities" },

      // Project each as: Relief Center ID, Name, Type (Job), Number Required, Updated At
      {
        $project: {
          task_id: "$volunteers.opportunities._id",
          relief_center_id: "$_id",
          name: 1,
          type: "$volunteers.opportunities.type",
          assigned: { $size: "$volunteers.opportunities.assigned" },
          volunteer_requests: {
            $size: "$volunteers.opportunities.requests.received"
          },
          admin_requests: { $size: "$volunteers.opportunities.requests.sent" },
          required: "$volunteers.opportunities.required",
          updatedAt: "$updatedAt"
        }
      },

      {
        $group: {
          _id: {
            name: "$name",
            type: "$type"
          },
          required: { $sum: "$required" },
          assigned: { $sum: "$assigned" },
          volunteer_requests: { $sum: "$volunteer_requests" },
          admin_requests: { $sum: "$admin_requests" },

          relief_center_id: { $first: "$relief_center_id" }
        }
      },

      {
        $project: {
          _id: 1,
          name: "$_id.name",
          type: "$_id.type",
          required: 1,
          assigned: 1,
          volunteer_requests: 1,
          admin_requests: 1,
          relief_center_id: 1,
          updatedAt: "$updatedAt"
        }
      },
      {
        $group: {
          _id: "$relief_center_id",
          name: { $first: "$name" },
          required: {
            $push: {
              type: "$type",
              total_capacity: "$required",
              assigned: "$assigned",
              volunteer_requests: "$volunteer_requests",
              admin_requests: "$admin_requests"
            }
          }
        }
      }
    ]);

    res.json(reliefCenterRequirements[0]);
  } catch (error) {
    next(error);
  }
};
