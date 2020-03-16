//For example: Strict mode doesn't allow usage of undeclared variables
"use strict";

const mongoose = require("./services/mongoose"); //Get the Mongoose Service
const app = require("./services/express"); // Get the Express App
const http = require("http"); // Require the http module
const socketIO = require("socket.io"); // Require the SOCKET.IO module
const server = http.createServer(app); // our server instance
const io = socketIO(server); // This creates our socket using the instance of the server
io.set("origins", "*:*");

// Relief Center Model
const ReliefCenter = require("./models/relief-center.model");

app.start(); // Start the Express App
mongoose.connect(); // Connect to MongoDB with Mongoose

io.on("connection", socket => {
  console.log("New Client Connected! - " + socket.id);

  // Returning the initial data of food menu from FoodItems collection
  socket.on("initialRequests", () => {
    ReliefCenter.find({}).then(reliefCenters => {
      io.sockets.emit("getReliefCenters", reliefCenters);
    });
  });

  // Requesting to volunteer - sent to Admin, gets called from the Mobile App Button 'Request to Volunteer'
  socket.on("volunteerToAdminRequest", async volunteerRequest => {
    // Get Task ID and Email ID from the request!
    const { taskID, emailID } = volunteerRequest;

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

            // res.status(httpStatus.OK);
            // res.json({ message: "Request has been approved!" });
          }
          // TODO: Add Status Code to indicate that the request cannot be completed.
          // res.json({ message: "Request could not be approved!" });
        } else {
          // res.status(httpStatus.NOT_FOUND);
          // res.json({
          //   message: "Requested task was not found in any Relief Center!"
          // });
        }
      }
    );
  });

  // disconnect is fired when a client leaves the server
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => console.log(`Listening on port 5000`));
