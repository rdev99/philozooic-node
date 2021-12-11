const Doctor = require("../models/Doctor");

exports.getDoctorById = async (doctorId) => {
  try {
    return await Doctor.findOne({ doctorId: doctorId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getAllDoctors = async () => {
  try {
    return await Doctor.find({});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.addDoctor = async (doctor) => {
  try {
    return await doctor.save();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateDoctorById = async (doctor) => {
  try {
    return await Doctor.updateOne(
      { doctorId: doctor.doctorId },
      { $set: { ...doctor } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.deleteDoctorById = async (doctorId) => {
  try {
    return await Doctor.deleteOne({ doctorId: doctorId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getDoctorsByAvgReview = async (locationArray, doctorId) => {
  try {
    let matchQuery = {};
    if (locationArray.length !== 0) {
      matchQuery = {
        location: { $in: locationArray },
      };
    }
    if (typeof doctorId !== "undefined") {
      matchQuery = { ...matchQuery, doctorId };
    }
    return await Doctor.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "review",
          localField: "doctorId",
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
