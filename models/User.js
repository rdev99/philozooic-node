const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const user = new mongoose.Schema({
  userId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
  },

  name: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: Number,
    required: true,
  },

  userType: {
    type: String,
  },

  targetUserId: {
    type: String,
    default: null,
  },

  gender: {
    type: String,
    required: true,
  },

  picturePath: {
    type: String,
  },
});

module.exports = mongoose.model("user", user, "user");
