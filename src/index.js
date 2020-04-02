//For example: Strict mode doesn't allow usage of undeclared variables
"use strict";

const mongoose = require("./services/mongoose"); //Get the Mongoose Service
const app = require("./services/express"); // Get the Express App
const http = require("http"); // Require the http module
const socketIO = require("socket.io"); // Require the SOCKET.IO module
const server = http.createServer(app); // our server instance
const io = socketIO(server); // This creates our socket using the instance of the server
io.set("origins", "*:*");

// var app = require('express')();
// var http = require('http').createServer(app);
// var io = require('socket.io')(http);

// All Data Models
const ReliefCenter = require("./models/relief-center.model");
const User = require("./models/user.model");
const Disaster = require("./models/disaster.model");

app.start(); // Start the Express App
mongoose.connect(); // Connect to MongoDB with Mongoose

const reliefCenterChangeStream = ReliefCenter.watch();
const userChangeStream = User.watch([], { fullDocument: "updateLookup" });
const disasterChangeStream = Disaster.watch();

reliefCenterChangeStream.on("change", change => {
  console.log("Relief Center Data was changed..", change);
  io.emit("reliefCenterDataChange", change);
});

userChangeStream.on("change", change => {
  console.log("User Data was changed..", change);
  io.emit("userChangeStream", change);
});

// Update Broadcast!
io.on("message", m => {
  // io.emit("message", m);
  // console.log(m);
});

io.on("connection", function(socket) {
  console.log("Connected to Client Socket!");

  // Handle Broadcasts from Admin - forward it to all clients!
  socket.on("broadcastMessage", function(message) {
    io.emit("broadcastMessage", { broadcast: message });
  });
});

var socket = io;
module.exports = socket;

// Socket.io Server
server.listen(5000, () => console.log(`Socket.io listening on port 5000`));
