"use strict";

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// User Model
const userModel = require("../../models/user.model");

// Relief Center Model
const reliefCenterModel = require("../../models/relief-center.model");

// Testing Routes with Sample MongoDB Data
router.get("/users/:name", async (req, res) => {
  // Destructuring Body Params
  const { userid, name } = req.params;

  // Update User Model
  userModel.update();

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

// Create User (Volunteers, Admins)
router.get("/create-user", async (req, res) => {
  const userCreatedInDB = await userModel.create({
    name: "Nikhil Wadekar",
    email: "nrwdkr@gmail.com",
    password: "password",
    profile_picture_url: "http://lorempixel.com/300/300",
    contact_number: 98292929,
    role: "admin",
    tasks: [
      {
        job_type: "Cooking",
        date: new Date(),
        location: "157, W 49th Ave, Vancouver, BC, CA - V5Y2Z7"
      },
      {
        job_type: "Driving",
        date: new Date(),
        location: "157, W 49th Ave, Vancouver, BC, CA - V5Y2Z7"
      }
    ],
    address: {
      street: "157, W 49th Ave",
      city: "Vancouver",
      country: "Canada",
      province: "British Columbia",
      postal_code: "V5Y2Z7"
    },
    preferences: {
      volunteering_type: ["Babysitting", "Cooking"],
      additional_skills: ["Driving"]
    },
    availability: {
      type: "anytime",
      schedule: [
        {
          date: new Date(),
          start_time: new Date().getTime,
          end_time: new Date().getTime
        }
      ]
    }
  });
  res.send(userCreatedInDB);
});

// Create Relief Centers
router.get("/create-relief-center", async (req, res) => {
  const reliefCenterInDB = await reliefCenterModel.create({
    name: "Main Street Relief Center",
    description: "It's on Main Street, lot of Punjabis here though.",
    picture_url: "http://lorempixel.com/300/300",
    location: "5910, Main Street, Vancouver, BC, CA",
    volunteers: {
      opportunities: [
        {
          type: "Cooking",
          date: new Date("2020", "05", "27"),
          time: {
            start: "05:00 AM",
            end: "09: 00 PM"
          },
          required: 2,
          assigned: ["nikhilrwadekar@gmail.com", "kjasmine2810@gmail.com"],
          requests: {
            sent: ["prabhjot3469@gmail.com", "polo90@gmail.com"],
            received: ["davinder.dhindsa@gmail.com"]
          }
        },
        {
          type: "Cooking",
          date: new Date("2020", "05", "27"),
          time: {
            start: "09:00 AM",
            end: "12:00 PM"
          },
          assigned: [],
          required: 3
        },
        {
          type: "Driving",
          date: new Date("2020", "05", "27"),
          time: {
            start: "10:00 AM",
            end: "09:00 PM"
          },
          assigned: ["blandy.fresh@hotmail.com", "ineedalcohol@gmail.com"],
          required: 5
        }
      ]
    }
  });
  res.send(reliefCenterInDB);
});

module.exports = router;
