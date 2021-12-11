const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Quote = new mongoose.Schema({
  quoteId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  quoteString: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  quotedById: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("quote", Quote, "quote");
