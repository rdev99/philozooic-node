const Pet = require("../models/Pet");

exports.getPetById = async (petId) => {
  try {
    return await Pet.findOne({ petId: petId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.addPet = async (pet) => {
  try {
    return await pet.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updatePetById = async (pet) => {
  try {
    return await Pet.updateOne({ petId: pet.petId }, { $set: { ...pet } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deletePetById = async (petId) => {
  try {
    return await Pet.deleteOne({ petId: petId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getPetsByOwnerId = async (ownerId) => {
  try {
    return await Pet.find({ ownerId: ownerId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getPetsByAvgReview = async (
  locationArray,
  mateStatusBoolean,
  petId
) => {
  try {
    let matchQuery = {};
    if (
      typeof mateStatusBoolean !== "undefined" &&
      mateStatusBoolean !== null
    ) {
      matchQuery = {
        mateStatus: mateStatusBoolean === "true",
      };
    }
    if (typeof petId !== "undefined") {
      matchQuery = { ...matchQuery, petId };
    }
    if (locationArray.length !== 0) {
      matchQuery = { ...matchQuery, location: { $in: locationArray } };
    }
    return await Pet.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "review",
          localField: "petId",
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
