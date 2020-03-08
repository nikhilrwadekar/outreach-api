const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var transactionSchema = new mongoose.Schema(
  {
    type: {
      type: "String",
      default: "donation"
    },
    amount: {
      type: "String",
      min: 1,
      required: true
    },
    currency: {
      type: "String",
      default: "CAD",
      required: true
    }
  }, // Save Created At, Update At Time fields!
  {
    timestamps: true
  }
);

//Export the model
module.exports = mongoose.model("Transaction", transactionSchema);
