const User = require("../models/User");

exports.addUser = async (user) => {
  return await user.save();
};

exports.getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserByTargetUserId = async (targetUserId) => {
  try {
    return await User.findOne({ targetUserId });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.getUserByById = async (id) => {
  try {
    return await User.findOne({ userId: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.updateUserById = async (user) => {
  try {
    return await User.updateOne({ userId: user.userId }, { $set: user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
