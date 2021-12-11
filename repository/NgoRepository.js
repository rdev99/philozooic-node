const Ngo = require("../models/Ngo");

exports.getNgoById = async (ngoId) => {
  try {
    return await Ngo.findOne({ ngoId: ngoId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.addNgo = async (ngo) => {
  try {
    return await ngo.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateNgoById = async (ngo) => {
  try {
    return await Ngo.updateOne({ ngoId: ngo.ngoId }, { $set: { ...ngo } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteNgoById = async (ngoId) => {
  try {
    return await Ngo.deleteOne({ ngoId: ngoId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getNgosByAvgReview = async (locationArray, ngoId) => {
  try {
    let matchQuery = {};
    if (locationArray.length !== 0) {
      matchQuery = {
        location: { $in: locationArray },
      };
    }
    if (typeof ngoId !== "undefined") {
      matchQuery = { ...matchQuery, ngoId };
    }
    return await Ngo.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "review",
          localField: "ngoId",
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
