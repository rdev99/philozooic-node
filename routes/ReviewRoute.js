const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLogged");

const reviewController = require("../controllers/ReviewController");

router.post("/", isLoggedIn, reviewController.addReview);

router.get("/with-user", reviewController.getReviewsWithReviewerData);

router.get("/:id", reviewController.getReviewById);

router.get("/", reviewController.getReviewsByReviewTypeAndReviewOfId);

router.put("/:id", isLoggedIn, reviewController.updateReviewById);

router.delete("/:id", isLoggedIn, reviewController.deleteReviewById);

module.exports = router;
