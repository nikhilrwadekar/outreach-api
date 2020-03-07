const mongoose = require("mongoose"); // Erase if already required

// User Roles
const roles = ["volunteer", "admin"];

// Availabilities
const availabilities = ["anytime", "preferred"];

// Task Schema
const taskSchema = new mongoose.Schema({
  job_type: String,
  date: Date,
  location: String
});

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 128
  },
  profile_picture_url: {
    type: String
    // match: "(http(s?):)([/|.|w|s|-])*.(?:jpg|gif|png)"
  },
  contact_number: {
    type: Number,
    required: false,
    unique: true
  },
  role: {
    type: String,
    default: "volunteer",
    enum: roles
  },
  tasks: {
    type: [taskSchema]
  },

  address: {
    street: {
      type: "String"
    },
    city: {
      type: String
    },
    country: {
      type: String
    },
    province: {
      type: String
    },
    postal_code: {
      type: String
    }
  },
  preferences: {
    volunteering_type: {
      type: [String]
    },
    additional_skills: {
      type: [String]
    }
  },
  availability: {
    type: {
      type: String,
      required: true,
      enum: availabilities
    },
    schedule: {
      type: ["Mixed"],
      required: function() {
        return this.type === "preferred";
      } // Only required if type equals 'preferred'
    }
  }
});

//Export the model
module.exports = mongoose.model("User", userSchema);
