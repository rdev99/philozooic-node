const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Pet = new mongoose.Schema({
  petId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  animalType: {
    type: String,
    required: true,
  },

  breed: {
    type: String,
    required: true,
  },

  ownerId: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  medicalHistory: {
    type: String,
  },

  mateStatus: {
    type: Boolean,
    required: true,
    default: false,
  },

  gender: {
    type: String,
    required: true,
  },

  picturePath: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("pet", Pet, "pet");
