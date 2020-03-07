"use strict";

const Joi = require("joi");

// Relief Center validation rules
module.exports = {
  createReliefCenter: {
    body: {
      name: Joi.string()
        .max(128)
        .required()
    }
  }
};
