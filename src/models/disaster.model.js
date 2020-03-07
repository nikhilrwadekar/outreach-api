const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema for Relief Centers of the Mongo model
const disasterSchema = new mongoose.Schema(
  {
    name: {
      type: "String"
    },
    city: {
      type: "String"
    },
    country: {
      type: "String"
    },
    description: {
      type: "String"
    },
    image_url: {
      type: "String"
    },
    donation: {
      goal: {
        type: "Number"
      },
      received: {
        type: "Number"
      }
    },
    donations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
  },
  // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("Disaster", disasterSchema);
