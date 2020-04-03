const mongoose = require("mongoose"); // Erase if already required

// Admin: Accepts/Declines Request

// {
// 	type: "Cooking",
// 	location: "Some Relief Center Name",
// 	address: "West Vancouver Region",
// 	date: "02-05-2020",
// 	start_time: "10:00 AM",
// 	end_time: "12:00 PM",
// 	status: "Confirmed"
// 	CREATED TIMESTAMP!
// }

// Volunteer Accepts/Declines Request

// {
// volunteer_email: "nikhilrwadekar@gmail.com"
// 	type: "Cooking",
// 	location: "Some Relief Center Name",
// 	address: "West Vancouver Region",
// 	date: "02-05-2020",
// 	start_time: "10:00 AM",
// 	end_time: "12:00 PM",
// 	status: "Confirmed"
// 	CREATED TIMESTAMP!
// }

const notification = {
  type: "", // response, request,
  email: "", // User associated
  data: {}
};

// Declare the Schema of the Mongo model
var notificationSchema = new mongoose.Schema(
  {
    email: {
      type: "String",
      required: true
    },

    role: String,
    action: String,
    task_id: String,
    task_name: String,
    location: String,
    address: String,
    date: Date,
    start_time: String,
    end_time: String,
    status: String,
    relief_center_id: String
  }, // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("Notification", notificationSchema);
