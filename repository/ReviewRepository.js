const Review = require("../models/Review");

exports.addReview = async (review) => {
  try {
    return await review.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getReviewById = async (reviewId) => {
  try {
    return await Review.findOne({ reviewId: reviewId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getReviewsByReviewTypeAndReviewOfId = async (
  reviewType,
  reviewOfId
) => {
  try {
    let query;
    if (reviewType) {
      query = { reviewType: reviewType };
    }
    if (reviewOfId) {
      query = { reviewOfId: reviewOfId, ...query };
    }
    return await Review.find(query).sort({ dateCreated: 1 });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getReviewsWithReviewerData = async (reviewOfId, reviewType) => {
  try {
    return await Review.aggregate([
      { $match: { reviewOfId, reviewType } },
      {
        $lookup: {
          from: "user",
          localField: "reviewerId",
          foreignField: "userId",
          as: "reviewerData",
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateReviewById = async (review) => {
  try {
    return Review.updateOne({ reviewId: review.reviewId }, { $set: review });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteReviewById = async (reviewId) => {
  try {
    return Review.deleteOne({ reviewId: reviewId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
