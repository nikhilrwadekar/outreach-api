// Get The Model
const Transaction = require("../models/transaction.model");

// Get Config
const config = require("../config");

// HTTP Status - Handling HTTP Status Codes Made Easier
const httpStatus = require("http-status");

// Get All Transactions
exports.getAllTransactions = async (req, res, next) => {
  try {
    const allTransactions = await Transaction.find();
    res.send(allTransactions);
  } catch (error) {
    return next(error);
  }
};

// Get Transaction
exports.getTransactionByID = async (req, res, next) => {
  try {
    const { id } = req.params; // Get the ID from Params

    const transaction = await Transaction.findOne({ _id: id }); // Find One by ID
    return res.json(transaction); // Return the Transaction
  } catch (error) {
    next(error);
  }
};

// Delete Transaction
exports.deleteTransactionByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    res.status(httpStatus.OK);
    return res.json({
      message: "Transaction was deleted!",
      data: deletedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

// Get Total Donated Grouped by Currency
exports.getTotalDonated = async (req, res, next) => {
  var pipeline = [
    {
      $group: {
        _id: "$_id",
        // Get the first currency ('CAD', 'EUR', etc. of the group - makes sense as it is common for them all - or in other words Group By this)
        currency: { $first: "$currency" },
        // The Field to Sum, Before summing convert to Int
        amount: { $sum: { $toInt: "$amount" } },
      },
    },
  ];
  Transaction.aggregate(pipeline, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
};
