const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: "String",
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid!"],
      index: true
    }
  }, // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("Token", refreshTokenSchema);
