const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Doctor = new mongoose.Schema({
  doctorId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },

  charge: {
    type: Number,
    required: true,
  },

  chargeDuration: {
    type: String,
    required: true,
    default: "session",
  },

  location: {
    type: String,
    required: true,
  },

  specialty: {
    type: String,
    required: true,
  },

  picturePath: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("doctor", Doctor, "doctor");
