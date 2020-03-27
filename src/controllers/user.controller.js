// Get The Model
const User = require("../models/user.model");
const ReliefCenter = require("../models/relief-center.model");
const mongoose = require("mongoose");
// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// POST User
exports.createUser = async (req, res, next) => {
  try {
    // Details for the User from the Request (body)
    const body = req.body;

    // Take the data from Request, Use the Model to create the entry
    const user = new User(body);

    // Save the entry into MongoDB
    const savedUser = await user.save();

    // Return with Status of Created
    res.status(httpStatus.CREATED);

    // Send back the data that was just created
    res.send(savedUser);
  } catch (error) {
    // Setup a check for Duplicate Email here
    return next(error);
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
    const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body);
    res.status(httpStatus.OK);
    return res.json({
      message: `User was updated - ${updatedUser._id}`
    });
  } catch (error) {
    next(error);
  }
};

// Request to Volunteer
exports.sendVolunteerRequest = async (req, res, next) => {
  try {
    const { userID, taskID, email } = req.params;

    // Find User with the UserID
    await User.findOne({ email: email }, async function(err, user) {
      if (err) {
        console.log("Error:", err);
      }

      // If User is found.. continue with the request or else, return a NOT FOUND
      if (user) {
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
              if (!task.requests.received.includes(user.email)) {
                // Push User's ID to the received
                task.requests.received.push(user.email);
                // Save Relief Center!
                reliefCenter.save();
                res.status(httpStatus.OK);
                res.json({ message: "Request has been sent!" });
              } else {
                // TODO: Add Status Code to indicate that the request cannot be completed.
                res.json({ message: "Request has already been sent!" });
              }
            } else {
              res.status(httpStatus.NOT_FOUND);
              res.json({
                message: "Requested task was not found in any Relief Center!"
              });
            }
          }
        );
      } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({ message: "User not found." });
      }
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// ==== ADMIN API CALLS ====
// =============================

// Not sure if this is needed - wait I think it is! for the Admin Panel
exports.getOpportunitiesGroupedByReliefCenter = async (req, res, next) => {
  try {
    let getUserAssignedTasks = await ReliefCenter.aggregate([
      // First Proper Attempt

      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },

      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          "volunteers.opportunities.date": 1,
          "volunteers.opportunities.type": 1,
          "volunteers.opportunities.time": 1
        }
      },
      // Group them in a particular fashion
      {
        $group: {
          _id: "$name",
          location: { $first: "$location" },
          tasks: { $push: "$volunteers.opportunities" }
        }
      }

      //Second Try
    ]);

    res.json(getUserAssignedTasks);

    console.log("Calleed");
    let opportunities = await ReliefCenter.find({
      "volunteers.opportunities.assigned": "nikhilrwadekar@gmail.com"
    });

    res.json(opportunities);
  } catch (error) {
    next(error);
  }
};

exports.getAllRequestsFromVolunteers = async (req, res, next) => {
  try {
    let allRequestsFromVolunteers = await ReliefCenter.aggregate([
      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },

      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          "volunteers.opportunities._id": 1,
          "volunteers.opportunities.date": 1,
          "volunteers.opportunities.type": 1,
          "volunteers.opportunities.time": 1,
          "volunteers.opportunities.requests.received": 1
        }
      },

      // Unwind Againg
      { $unwind: "$volunteers.opportunities.requests.received" },

      {
        $project: {
          _id: 0,
          relief_center_id: "$_id",
          task_id: "$volunteers.opportunities._id",
          name: 1,
          location: 1,
          date: "$volunteers.opportunities.date",
          type: "$volunteers.opportunities.type",
          start_time: "$volunteers.opportunities.time.start",
          end_time: "$volunteers.opportunities.time.end",
          volunteer_email: "$volunteers.opportunities.requests.received"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "volunteer_email",
          foreignField: "email",
          as: "user_docs"
        }
      },
      {
        $project: {
          // _id: 0,
          relief_center_id: 1,
          task_id: 1,
          name: 1,
          location: 1,
          date: 1,
          type: 1,
          start_time: 1,
          end_time: 1,
          volunteer_email: 1,
          volunteer_name: { $arrayElemAt: ["$user_docs.name", 0] }
        }
      }
    ]);
    console.log("Sending all requests!");
    res.json(allRequestsFromVolunteers);
  } catch (error) {
    next(error);
  }
};

exports.requestUserToVolunteerForTask = async (req, res, next) => {
  // const {emailID, taskID} = req.params;
  try {
    const { userID, taskID, email } = req.params;

    // Find User with the UserID
    await User.findOne({ email: email }, async function(err, user) {
      if (err) {
        console.log("Error:", err);
      }

      // If User is found.. continue with the request or else, return a NOT FOUND
      if (user) {
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
              if (!task.requests.sent.includes(user.email)) {
                // Push User's ID to the sent
                task.requests.sent.push(user.email);
                // Save Relief Center!
                reliefCenter.save();
                res.status(httpStatus.OK);
                res.json({ message: "Request has been sent!" });
              } else {
                // TODO: Add Status Code to indicate that the request cannot be completed.
                res.json({ message: "Request has already been sent!" });
              }
            } else {
              res.status(httpStatus.NOT_FOUND);
              res.json({
                message: "Requested task was not found in any Relief Center!"
              });
            }
          }
        );
      } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({ message: "User not found." });
      }
    });
  } catch (error) {
    next(error);
  }
};

// =============================
// ==== VOLUNTEER API CALLS ====
// =============================

// Get Opportunities (for Mobile Home)
exports.getAllOpportunities = async (req, res, next) => {
  try {
    let allOpportunties = await ReliefCenter.aggregate([
      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },

      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          description: 1,
          picture_url: 1,
          opportunity_id: "$volunteers.opportunities._id",
          opportunity_date: "$volunteers.opportunities.date",
          opportunity_type: "$volunteers.opportunities.type",
          opportunity_time: "$volunteers.opportunities.time",
          opportunity_required: "$volunteers.opportunities.required",
          opportunity_assigned: "$volunteers.opportunities.assigned",
          opportunity_requested: "$volunteers.opportunities.requests.received"
        }
      },
      // Only return those which have True Dates
      {
        $match: {
          opportunity_date: {
            $gte: new Date()
          }
        }
      }
    ]);
    console.log("Sending all requests!");
    res.json(allOpportunties);
  } catch (error) {
    next(error);
  }
};
// Get Requests assigned/approved by Admin based on User Email
exports.getAssignedOpportunitiesByUserEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    let getUserAssignedTasks = await ReliefCenter.aggregate([
      // First Proper Attempt

      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },
      // Match the ones where the user with 'email' is 'assigned'
      {
        $match: {
          "volunteers.opportunities.assigned": email
        }
      },
      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          job_type: "$volunteers.opportunities.type",
          job_id: "$volunteers.opportunities._id",
          job_date: "$volunteers.opportunities.date",
          job_start_time: "$volunteers.opportunities.time.start",
          job_end_time: "$volunteers.opportunities.time.end"
        }
      }
      // Group them in a particular fashion
      // {
      //   $group: {
      //     _id: "$_id",
      //     name: { $first: "$name" },
      //     location: { $first: "$location" },
      //     tasks: { $push: "$volunteers.opportunities" }
      //   }
      // }
    ]);

    res.json(getUserAssignedTasks);
  } catch (error) {
    next(error);
  }
};

// Get Requests sent to Admin based on User Email
exports.getRequestedOpportunitiesByUserEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    let getUserRequestsSendToAdmin = await ReliefCenter.aggregate([
      // First Proper Attempt

      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },
      // Match the ones where the user with 'email' has 'request' 'received'
      {
        $match: {
          "volunteers.opportunities.requests.received": email
        }
      },
      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          "volunteers.opportunities._id": 1,
          "volunteers.opportunities.date": 1,
          "volunteers.opportunities.type": 1,
          "volunteers.opportunities.time": 1
        }
      },
      // Group them in a particular fashion
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          location: { $first: "$location" },
          requests: { $push: "$volunteers.opportunities" }
        }
      }

      //Second Try
    ]);

    res.json(getUserRequestsSendToAdmin);
  } catch (error) {
    next(error);
  }
};

// Get Requests received by Admin based on User Email
exports.getReceivedOpportunitiesByUserEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    let getUserRequestsSendFromAdmin = await ReliefCenter.aggregate([
      // First Proper Attempt

      // Unwind all opportunities
      { $unwind: "$volunteers.opportunities" },
      // Match the ones where the user with 'email' has 'request' 'received'
      {
        $match: {
          "volunteers.opportunities.requests.sent": email
        }
      },
      // Only pass on the following fields
      {
        $project: {
          name: 1,
          location: 1,
          job_type: "$volunteers.opportunities.type",
          job_id: "$volunteers.opportunities._id",
          job_date: "$volunteers.opportunities.date",
          job_start_time: "$volunteers.opportunities.time.start",
          job_end_time: "$volunteers.opportunities.time.end"
        }
      }
      // DONT COMMENT THE ONES BELOW - You almost banged your head on the wall learning it.. ;-;
      // // Group them in a particular fashion
      // {
      //   $group: {
      //     _id: "$_id",
      //     name: { $first: "$name" },
      //     location: { $first: "$location" },
      //     requests: { $push: "$volunteers.opportunities" }
      //   }
      // }
    ]);

    res.json(getUserRequestsSendFromAdmin);
  } catch (error) {
    next(error);
  }
};

// Suggest a random number of users
exports.suggestRandomNumberOfVolunteers = async (req, res, next) => {
  const { number } = req.params;

  const users = await User.aggregate(
    [
      // { $project: { name: 1, password: 0 } },

      { $match: { role: "volunteer" } }, // Get Volunteers Only
      { $sample: { size: parseInt(number ? number : "1") } },
      {
        $project: {
          name: 1,
          email: 1
        }
      }
    ],
    (err, users) => {
      if (err) next(err);
    }
  );

  res.send(users);
};

// Opt out from a task
exports.optOutFromTask = async (req, res, next) => {
  try {
    const { email, taskID } = req.params;
    // Find Relief Center that has the task with taskID
    await ReliefCenter.findOne(
      { "volunteers.opportunities._id": taskID },
      async function(err, reliefCenter) {
        if (err) next(err);

        // If Relief Center is found..
        if (reliefCenter) {
          // Get the concerned Task from the Relief Center
          let task = await reliefCenter.volunteers.opportunities.id(taskID);

          // Add User's has been assigned
          if (task.assigned.includes(email)) {
            // Pop User's ID from assigned
            task.assigned.pop(email);
            // Save Relief Center!
            reliefCenter.save();
            res
              .status(httpStatus.OK)
              .json({ message: "User successfully opted out!" });
          } else {
            // TODO: Add Status Code to indicate that the request cannot be completed.
            res.json({ message: "Already opted out!" });
          }
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            message: "Requested task was not found in any Relief Center!"
          });
        }
      }
    );
  } catch (error) {}
};

// Opt out from a task
exports.optInToTask = async (req, res, next) => {
  try {
    const { email, taskID } = req.params;
    // Find Relief Center that has the task with taskID
    await ReliefCenter.findOne(
      { "volunteers.opportunities._id": taskID },
      async function(err, reliefCenter) {
        if (err) next(err);

        // If Relief Center is found..
        if (reliefCenter) {
          // Get the concerned Task from the Relief Center
          let task = await reliefCenter.volunteers.opportunities.id(taskID);

          // Add User's has been requests.sent
          if (task.requests.sent.includes(email)) {
            // Pop User's ID from requests.sent
            task.requests.sent.pop(email);

            // Add it to assigned!
            task.assigned.push(email);

            // Save Relief Center!
            reliefCenter.save();
            res
              .status(httpStatus.OK)
              .json({ message: "User successfully opted in!" });
          } else {
            // TODO: Add Status Code to indicate that the request cannot be completed.
            res.json({ message: "Already opted in!" });
          }
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            message: "Requested task was not found in any Relief Center!"
          });
        }
      }
    );
  } catch (error) {}
};

// Decline a task
exports.declineTask = async (req, res, next) => {
  try {
    const { email, taskID } = req.params;
    // Find Relief Center that has the task with taskID
    await ReliefCenter.findOne(
      { "volunteers.opportunities._id": taskID },
      async function(err, reliefCenter) {
        if (err) next(err);

        // If Relief Center is found..
        if (reliefCenter) {
          // Get the concerned Task from the Relief Center
          let task = await reliefCenter.volunteers.opportunities.id(taskID);

          // Add User's has been requests.sent
          if (task.requests.sent.includes(email)) {
            // Pop User's ID from requests.sent
            task.requests.sent.pop(email);

            // Won't be assigned, as declined..

            // Save Relief Center!
            reliefCenter.save();
            res
              .status(httpStatus.OK)
              .json({ message: "User successfully declined task!" });
          } else {
            // TODO: Add Status Code to indicate that the request cannot be completed.
            res.json({ message: "Already declined!" });
          }
        } else {
          res.status(httpStatus.NOT_FOUND).json({
            message: "Requested task was not found in any Relief Center!"
          });
        }
      }
    );
  } catch (error) {}
};
