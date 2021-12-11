const { v4: uuidv4 } = require("uuid");
const BCrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const envData = process.env;

const userRepository = require("../repository/UserRepository");

const ERROR_MESSAGE = "An internal server occurred!";

exports.addUser = async (req, res, next) => {
  const {
    email,
    name,
    password,
    phoneNumber,
    userType,
    gender,
    targetUserId,
    picturePath,
  } = req.body;
  await userRepository
    .getUserByEmail(email)
    .then((result) => {
      if (result !== null) {
        console.error(`A user with email: ${email} already exists.`);
        return res
          .status(409)
          .send(`User with email: ${email} already exists!`);
      }
      BCrypt.hash(password, 12, async (err, hash) => {
        if (err) {
          console.error(
            `There was an error while encrypting the password.`,
            err
          );
          return res.status(500).send(ERROR_MESSAGE);
        }
        const user = new User({
          userId: uuidv4(),
          email,
          name,
          password: hash,
          phoneNumber,
          userType,
          gender,
          targetUserId,
          picturePath,
        });
        await userRepository
          .addUser(user)
          .then((addedUser) => {
            const token = JWT.sign(
              {
                email: addedUser.email,
                userId: addedUser.userId,
                userType: addedUser.userType,
                targetUserId: addedUser.targetUserId,
              },
              envData.JWT_KEY,
              {
                expiresIn: "2h",
              }
            );
            console.info(
              `A new user with email: ${email} and userId: ${addedUser.userId} was successfully added to the database.`
            );
            return res.status(200).json({ user: addedUser, token });
          })
          .catch((error) => {
            console.error("An error occurred while adding the user.", error);
            return res
              .status(400)
              .send("An error occurred while adding the user.", error);
          });
      });
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching users with email: ${email}.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  await userRepository
    .getUserByEmail(email)
    .then((user) => {
      if (user === null) {
        console.error(`User with ID: ${email} doesn't exist!`);
        return res.status(404).send(`User with ID: ${email} doesn't exist!`);
      }
      BCrypt.compare(password, user.password).then((matches) => {
        if (matches) {
          const token = JWT.sign(
            {
              email: user.email,
              userId: user.userId,
              userType: user.userType,
              targetUserId: user.targetUserId,
            },
            envData.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );
          console.info(`Login successful.`);
          return res.status(200).json({ user: user, token: token });
        } else {
          console.warn(`Incorrect credentials.`);
          return res.status(403).send("Incorrect credentials");
        }
      });
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching users with email: ${email}.`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  await userRepository
    .getUserByById(id)
    .then((foundUser) => {
      if (foundUser === null) {
        console.error(`User with userId: ${id} doesn't exist.`);
        return res.status(404).send(`User with ID: ${id} doesn't exist!`);
      }
      console.info(`User with userId: ${id} was successfully found.`);
      return res.status(200).send(foundUser);
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching user with userId: ${id}`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.getUserByTargetUserId = async (req, res, next) => {
  const { targetUserId } = req.params;
  await userRepository
    .getUserByTargetUserId(targetUserId)
    .then((foundUser) => {
      if (foundUser === null) {
        console.error(`User with targetUserID: ${targetUserId} doesn't exist!`);
        return res
          .status(404)
          .send(`User with targetUserID: ${targetUserId} doesn't exist!`);
      }
      console.info(
        `User with targetUserID: ${targetUserId} was successfully found.`
      );
      return res.status(200).send(foundUser);
    })
    .catch((error) => {
      console.error(
        `There was an error while fetching user with targetUserId: ${targetUserId}`,
        error
      );
      return res.status(500).send(ERROR_MESSAGE);
    });
};

exports.updateUserById = async (req, res, next) => {
  const { id } = req.params;
  const {
    userId,
    email,
    name,
    phoneNumber,
    userType,
    gender,
    targetUserId,
    picturePath,
  } = req.body.user;
  if (id !== userId) {
    console.error("The ID in the body and the path must be same");
    return res.status(400).send("The ID in the body and the path must be same");
  }
  let user = {
    userId,
    email,
    name,
    phoneNumber,
    userType,
    gender,
    targetUserId,
    picturePath,
  };
  await userRepository
    .getUserByById(id)
    .then(async (foundUser) => {
      if (foundUser == null) {
        console.error(`Update Failed: User with userId: ${id} doesn't exist!`);
        return res
          .status(404)
          .send(`Update Failed: User with userId: ${id} doesn't exist!`);
      }
      await userRepository
        .updateUserById(user)
        .then((updatedStatus) => {
          if (
            updatedStatus.nModified >= 0 &&
            updatedStatus.n >= 1 &&
            updatedStatus.ok >= 1
          ) {
            console.info(`User with userId: ${id} was successfully updated.`);
            return res.status(200).send(user);
          }
          console.error(
            `Update Failed: User with userId: ${id} was not updated.`
          );
          return res.status(500).send(ERROR_MESSAGE);
        })
        .catch((error) => {
          console.error(
            `Update Failed: User with userId: ${id} was found but not updated.`,
            error
          );
          return res.status(500).send(ERROR_MESSAGE);
        });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send(ERROR_MESSAGE);
    });
};
