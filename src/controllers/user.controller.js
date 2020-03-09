// Get The Model
const User = require("../models/user.model");
const ReliefCenter = require("../models/relief-center.model");
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
    const { userID, taskID } = req.params;

    let userFound,
      taskFound = false;
    // Find User with the UserID
    const currentUser = await User.findOne({ _id: userID }, function(
      err,
      result
    ) {
      if (err) {
        console.log("Error");
      }

      if (result) {
        console.log("User Found!");
      } else {
        console.log("User Not Found!");
      }
    });

    // If User is found.. continue with the request or else, return a NOT FOUND
    if (currentUser) {
      // Find Relief Center that has the task with taskID
      const foundReliefCenterWithTheTask = await ReliefCenter.findOne(
        { "volunteers.opportunities._id": taskID },
        function(err, reliefCenter) {
          if (err) next(err);
        }
      );

      if (foundReliefCenterWithTheTask) {
        // Get the concerned Task from the Relief Center
        let task = foundReliefCenterWithTheTask.volunteers.opportunities.id(
          taskID
        );

        // Add User's Request - if it hasnt been added already
        if (!task.requests.received.includes(currentUser.email)) {
          // Push User's ID to the received
          task.requests.received.push(currentUser.email);
          // Save Relief Center!
          foundReliefCenterWithTheTask.save();
          res.status(httpStatus.OK);
          res.json({ message: "Request has been sent!" });
        }
        // TODO: Add Status Code to indicate that the request cannot be completed.
        res.json({ message: "Request has already been sent!" });
      } else {
        res.status(httpStatus.NOT_FOUND);
        res.json({ message: "Task not found!" });
      }
    } else {
      res.status(httpStatus.NOT_FOUND);
      res.json({ message: "User not found." });
    }
  } catch (error) {
    next(error);
  }
};

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
          tasks: { $push: "$volunteers.opportunities" }
        }
      }
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

    res.json(getUserRequestsSendFromAdmin);
  } catch (error) {
    next(error);
  }
};
