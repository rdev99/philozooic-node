const express = require("express");
const router = express.Router();

const quoteController = require("../controllers/QuoteController");

router.post("/", quoteController.addQuote);

router.get("/by/:type", quoteController.getQuotesByQuoteTypeAndQuotedByDetails);

module.exports = router;
