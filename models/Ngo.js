const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Ngo = new mongoose.Schema({
  ngoId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  upiId: {
    type: String,
    required: true,
  },

  bankIFSC: {
    type: String,
    required: true,
  },

  accountNumber: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
  },

  about: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true,
  },

  picturePath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ngo", Ngo, "ngo");
