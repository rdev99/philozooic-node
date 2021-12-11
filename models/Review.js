const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Review = new mongoose.Schema({
  reviewId: {
    type: String,
    default: uuidv4(),
    unique: true,
  },

  reviewType: {
    type: String,
    required: true,
  },

  reviewString: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    required: true,
    min: [
      0,
      "The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).",
    ],
    max: [5, "The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX})."],
  },

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now,
  },

  reviewOfId: {
    type: String,
    required: true,
  },

  reviewerId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("review", Review, "review");
