const Caretaker = require("../models/Caretaker");

exports.getCaretakerById = async (caretakerId) => {
  try {
    return await Caretaker.findOne({ caretakerId: caretakerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.addCaretaker = async (caretaker) => {
  try {
    return await caretaker.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateCaretakerById = async (caretaker) => {
  try {
    return await Caretaker.updateOne(
      { caretakerId: caretaker.caretakerId },
      { $set: { ...caretaker } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteCaretakerById = async (caretakerId) => {
  try {
    return await Caretaker.deleteOne({ caretakerId: caretakerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getCaretakersByAvgReview = async (locationArray) => {
  try {
    let matchQuery = {};
    if (locationArray.length !== 0) {
      matchQuery = {
        location: { $in: locationArray },
      };
    }
    return await Caretaker.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "review",
          localField: "caretakerId",
          foreignField: "reviewOfId",
          as: "reviewData",
        },
      },
      {
        $addFields: {
          reviewAvg: {
            $avg: "$reviewData.rating",
          },
          reviewCount: {
            $size: "$reviewData",
          },
        },
      },
      {
        $sort: {
          reviewAvg: -1,
          reviewCount: -1,
        },
      },
    ]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
