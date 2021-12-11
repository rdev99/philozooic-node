const Quote = require("../models/Quote");

exports.addQuote = async (quote) => {
  try {
    return await quote.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getQuoteWithQuoteTypeAndQuotedByDetails = async (type) => {
  try {
    return await Quote.aggregate([
      { $match: { type } },
      {
        $lookup: {
          from: type === "Doctor" ? "doctor" : "ngo",
          localField: "quotedById",
          foreignField: type === "Doctor" ? "doctorId" : "ngoId",
          as: "quotedBy",
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
