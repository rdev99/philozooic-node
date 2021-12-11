const { v4: uuidv4 } = require("uuid");

const Review = require("../models/Review");
const reviewRepository = require("../repository/ReviewRepository");

const ERROR_MESSAGE = "An internal server occurred!";

exports.addReview = async (req, res, next) => {
  try {
    const {
      reviewType,
      reviewString,
      rating,
      dateCreated,
      reviewOfId,
      reviewerId,
    } = req.body.review;

    let review = new Review({
      reviewId: uuidv4(),
      reviewType,
      reviewString,
      rating,
      dateCreated,
      reviewOfId,
      reviewerId,
    });

    await reviewRepository
      .addReview(review)
      .then((addedReview) => {
        console.info(
          `Review with reviewId: ${addedReview.reviewId} was successfully added.`
        );
        return res.status(200).send(addedReview);
      })
      .catch((error) => {
        console.error(`There was an issue while adding a new review.`, error);
        return res
          .status(500)
          .send(`There was an issue while adding a new review.`);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    let reviewId = req.params.id;
    await reviewRepository
      .getReviewById(reviewId)
      .then((foundReview) => {
        if (foundReview == null) {
          console.error(`No review was found with ID: ${reviewId}`);
          return res
            .status(404)
            .send(`Review with ID: ${reviewId} was not found!`);
        }
        console.info(`Review with ID: ${reviewId} was successfully found.`);
        return res.status(200).send(foundReview);
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching the review with reviewId: ${reviewId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getReviewsByReviewTypeAndReviewOfId = async (req, res, next) => {
  try {
    let { reviewType, reviewOfId } = req.query;
    await reviewRepository
      .getReviewsByReviewTypeAndReviewOfId(reviewType, reviewOfId)
      .then((foundReviews) => {
        if (foundReviews.length === 0) {
          return res
            .status(404)
            .send(
              `No reviews found for review type ${reviewType} and of ID: ${reviewOfId}`
            );
        }
        console.info(
          `Reviews with ReviewType: ${reviewType} and Review Of Id: ${reviewOfId} were successfully found.`
        );
        return res.status(200).send(foundReviews);
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching reviews with ReviewType: ${reviewType} and Review Of Id: ${reviewOfId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateReviewById = async (req, res, next) => {
  try {
    let revId = req.params.id;
    const { reviewId } = req.body.review;

    if (revId !== reviewId) {
      console.error(
        "The ID in the path must be same as the one in the request body"
      );
      return res
        .status(400)
        .send("The ID in the path must be same as the one in the request body");
    }
    await reviewRepository
      .getReviewById(revId)
      .then(async (foundReview) => {
        if (foundReview == null) {
          console.error(
            `Update Failed: Review with ID: ${revId} was not found.`
          );
          return res
            .status(404)
            .send(`The review with ID: ${revId} was not found!`);
        }
        await reviewRepository
          .updateReviewById(req.body.review)
          .then((updatedStatus) => {
            if (
              updatedStatus.nModified >= 0 &&
              updatedStatus.n >= 1 &&
              updatedStatus.ok >= 1
            ) {
              console.info(
                `Review with reviewId: ${revId} was successfully updated.`
              );
              return res.status(200).send(req.body.review);
            }
          })
          .catch((error) => {
            console.error(
              `There was some error while deleting the review with reviewId: ${revId}`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Update Failed: There was some problem fetching the review with Id: ${revId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deleteReviewById = async (req, res, next) => {
  try {
    let revId = req.params.id;

    await reviewRepository
      .getReviewById(revId)
      .then(async (foundReview) => {
        if (foundReview == null) {
          console.error(
            `Delete Failed: Review with ID: ${revId} was not found.`
          );
          return res
            .status(404)
            .send(`Review with ID: ${revId} doesn't exist!`);
        }
        await reviewRepository
          .deleteReviewById(revId)
          .then((result) => {
            if (result.deletedCount > 0) {
              console.info(
                `Review with reviewId: ${revId} was successfully deleted.`
              );
              return res.status(200).send(foundReview);
            }
          })
          .catch((error) => {
            console.error(
              `There was some error while deleting the review with reviewId: ${revId}`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Delete Failed: Review with ID: ${revId} was not found`,
          error
        );
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getReviewsWithReviewerData = async (req, res, next) => {
  try {
    let { reviewOfId, reviewType } = req.query;
    await reviewRepository
      .getReviewsWithReviewerData(reviewOfId, reviewType)
      .then((foundReviews) => {
        if (foundReviews.length === 0) {
          console.error(
            `No Reviews with reviewType: ${reviewType} and reviewOfId: ${reviewOfId} with reviewer data were found.`
          );
          return res
            .status(404)
            .send(
              `No Reviews with reviewType: ${reviewType} and reviewOfId: ${reviewOfId} with reviewer data were found.`
            );
        }
        console.info(
          `Reviews with reviewType: ${reviewType} and reviewOfId: ${reviewOfId} with reviewer data were successfully found.`
        );
        return res.status(200).send(foundReviews);
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching the reviews for reviewType: ${reviewType} with reviewOfId: ${reviewOfId} with their user data.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};
