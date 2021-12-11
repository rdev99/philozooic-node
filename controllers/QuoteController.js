const { v4: uuidv4 } = require("uuid");

const Quote = require("../models/Quote");
const quoteRepository = require("../repository/QuoteRepository");

exports.addQuote = async (req, res, next) => {
  try {
    const { quoteString, type, quotedById } = req.body;

    let quote = new Quote({ quoteId: uuidv4(), quoteString, type, quotedById });
    await quoteRepository
      .addQuote(quote)
      .then((addedQuote) => {
        console.info(
          `Quote with quoteId: ${addedQuote.quoteId} was successfully added.`
        );
        return res.status(200).send(addedQuote);
      })
      .catch((error) => {
        console.error(`There was a problem while adding a new quote.`, error);
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getQuotesByQuoteTypeAndQuotedByDetails = async (req, res, next) => {
  try {
    let { type } = req.params;
    await quoteRepository
      .getQuoteWithQuoteTypeAndQuotedByDetails(type)
      .then((quoteData) => {
        if (quoteData.length === 0) {
          console.error(`There are no quotes with type: ${type}`);
          return res.status(404).send(`There are no quotes with type: ${type}`);
        }
        console.info(
          `Quotes of type ${type} with quotedBy details were successfully found.`
        );
        return res.status(200).send(quoteData);
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching quote details with type: ${type}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

const ERROR_MESSAGE = "An internal server error occurred!";
