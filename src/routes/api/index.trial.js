"use strict";
const express = require("express");
// Express Router
const router = express.Router();
// Mongoose Connection
const db = require("../../services/mongoose");



// User Model
const userModel = require("../../models/user.model");

// Relief Center Model
const reliefCenterModel = require("../../models/relief-center.model");

// Disaster Model
const disasterModel = require("../../models/disaster.model");

// Transaction Model
const transactionModel = require("../../models/transaction.model");

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

// Create Relief Centers
router.get("/create-disaster", async (req, res) => {
  // Get Donations Array from the Request - Create transactionModel forEach

  let donations = [
    {
      type: "donation",
      amount: 100,
      currency: "CAD"
    },
    {
      type: "donation",
      amount: 123,
      currency: "CAD"
    },
    {
      type: "donation",
      amount: 76,
      currency: "CAD"
    }
  ];

  let donationAsTransactions = [];
  // Get Donations, Make Transactions, Wait until it's made and then pass into the Disaster Model

  donations.forEach(async donation => {
    const donationAsTransaction = await transactionModel.create({
      type: "donation",
      amount: 100,
      currency: "CAD"
    });

    donationAsTransactions.push(donationAsTransaction);
  });

  const disasterInDB = await disasterModel.create({
    name: "Australian Bushfires",
    city: "Mallacoota, Victoria",
    country: "Australia",
    description:
      "Dozens of fires erupted in New South Wales, Australia, prompting the government to declare a state of emergency in November 2019. Fires rapidly spread across all states to become some of the most devastating on record. An area about the size of South Korea, roughly 25.5 million acres, has burned. At least 33 people are dead, including at least three volunteer firefighters, and more are missing. Around 3,000 homes have been destroyed or damaged. As blazes intensified in the days leading up to New Year’s Eve, thousands of people who were forced to evacuate sought shelter on beaches across New South Wales and Victoria.",
    image_url:
      "https://cdn.vox-cdn.com/thumbor/yEe8NmlUYsCpCeXlva6FoAsWZHQ=/0x0:3000x2000/1820x1213/filters:focal(1260x760:1740x1240):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/66021728/1184740878.jpg.0.jpg",
    donation: {
      goal: 200000,
      received: 110000
    },
    donations: donationAsTransactions
  });
  res.send(disasterInDB);
});

module.exports = router;
