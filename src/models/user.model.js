const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

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

// Schedule Schema
const scheduleSchema = new mongoose.Schema({
  date: Date,
  start_time: String,
  end_time: String
});

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
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
      type: String,
      default: ""
    },
    contact_number: {
      type: Number,
      required: false
      // unique: true
    },
    role: {
      type: String,
      default: "volunteer",
      enum: roles
    },
    tasks: {
      type: [taskSchema],
      required: function() {
        return this.role === "volunteer";
      } // Only required if role equals 'volunteer'
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
      type: {
        required: function() {
          return this.role === "volunteer";
        } // Only required if role equals 'volunteer'
      },
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
        required: function() {
          return this.role === "volunteer";
        }, // Only required if role equals 'volunteer'
        enum: availabilities
      },
      schedule: {
        type: [scheduleSchema],
        required: function() {
          return this.role === "volunteer" && this.type === "preferred";
        } // Only required if type equals 'preferred'
      }
    }
  },
  // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

// Before Saving the User!
userSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// Check if the password is the same or not
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

//Export the model
module.exports = mongoose.model("User", userSchema);
