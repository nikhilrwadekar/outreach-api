// Courtesy: https://dev.to/rexeze/how-to-build-a-real-time-chat-app-with-nodejs-socketio-and-mongodb-2kho
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const url = process.env.MONGOURI;
const connect = mongoose.connect(url, { useNewUrlParser: true });
module.exports = connect;
