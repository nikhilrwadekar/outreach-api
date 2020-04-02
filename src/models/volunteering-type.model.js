const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var volunteeringTypeSchema = new mongoose.Schema(
  {
    name: {
      type: "String",

      required: true
    },
    image_url: {
      type: "String",
      min: 1,
      required: true
    }
  }, // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("VolunteeringType", volunteeringTypeSchema);
