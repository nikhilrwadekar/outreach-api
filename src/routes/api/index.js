"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Getting Schema
const Schema = mongoose.Schema;

const userModel = require("../../models/user.model");

// Testing Routes with Sample MongoDB Data
router.get("/users/:name", async (req, res) => {
  // Destructuring Body Params
  const { userid, name } = req.params;
  const userFromDb = await userModel.find(
    {
      name: name
    },
    (err, doc) => {
      if (err) {
        console.log(`Error: ` + err);
      } else {
        if (!doc) {
          console.log("No Error!");
        } else {
        }
      }
    }
  );
  res.send(userFromDb);
});

module.exports = router;
