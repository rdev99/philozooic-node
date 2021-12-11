const { v4: uuidv4 } = require("uuid");

const Caretaker = require("../models/Caretaker");
const caretakerRepository = require("../repository/CaretakerRepository");

const ERROR_MESSAGE = "An internal server error occurred!";

exports.addCaretaker = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    } = req.body;

    let caretaker = new Caretaker({
      caretakerId: uuidv4(),
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      picturePath,
      address,
    });

    await caretakerRepository
      .addCaretaker(caretaker)
      .then((result) => {
        console.info(
          `Caretaker with caretakerId: ${result.caretakerId} was successfully adeed.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was some error while adding a new caretaker.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getCaretakerById = async (req, res, next) => {
  try {
    let caretakerId = req.params.id;

    await caretakerRepository
      .getCaretakerById(caretakerId)
      .then((result) => {
        if (result == null) {
          console.error(
            `Caretaker with caretakerId: ${caretakerId} doesn't exist.`
          );
          return res
            .status(404)
            .send(`Caretaker with ID: ${caretakerId} doesn't exist!`);
        }
        console.info(
          `Caretaker with caretakerId: ${caretakerId} was successfully found.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching caretaker with caretakerId: ${caretakerId} from the database`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateCaretakerById = async (req, res, next) => {
  try {
    let caretakerID = req.params.id;
    const { caretakerId } = req.body;

    if (caretakerID != caretakerId) {
      console.warn(
        "The ID in the body must be the same as that in the path parameter."
      );
      return res
        .status(400)
        .send(
          "The ID in the body must be the same as that in the path parameter."
        );
    }
    await caretakerRepository
      .getCaretakerById(caretakerId)
      .then(async (result) => {
        if (result == null) {
          console.error(
            `Update Failed: Caretaker with caretakerId: ${caretakerId} doesn't exist.`
          );
          return res
            .status(404)
            .send(
              `Update failed: Caretaker with ID: ${caretakerId} doesn't exist!`
            );
        }
        await caretakerRepository
          .updateCaretakerById(req.body)
          .then((updatedStatus) => {
            if (
              updatedStatus.nModified > 0 &&
              updatedStatus.ok >= 1 &&
              updatedStatus.n >= 1
            ) {
              console.info(
                `Caretaker with caretakerId: ${caretakerId} was successfully updated.`
              );
              return res.status(200).send(req.body);
            }
            console.error(
              `Update Failed: Caretaker with caretakerId: ${caretakerId} was not updated.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Update Failed: Caretaker with caretakerId: ${caretakerId} was found but not updated.`
            );
          });
      })
      .catch((error) => {
        console.error(
          `There was some error while fetching the caretaker with caretakerId: ${caretakerId} from the database`,
          error
        );
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deleteCaretakerById = async (req, res, next) => {
  try {
    let caretakerId = req.params.id;

    await caretakerRepository
      .getCaretakerById(caretakerId)
      .then(async (foundCaretaker) => {
        if (foundCaretaker == null) {
          console.error(
            `Delete Failed: Caretaker with caretakerId: ${caretakerId} doesn't exist.`
          );
          return res
            .status(404)
            .send(
              `Delete Failed: Caretaker with caretakerId: ${caretakerId} doesn't exist.`
            );
        }
        await caretakerRepository
          .deleteCaretakerById(caretakerId)
          .then((result) => {
            if (result.deletedCount > 0) {
              console.info(
                `Caretaker with caretakerId: ${caretakerId} was successfully deleted.`
              );
              return res.status(200).send(foundCaretaker);
            }
            console.error(
              `Deleted Failed: Caretaker with caretakerId: ${caretakerId} was not deleted.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Delete Failed: Caretaker with caretakerId: ${caretakerId} was found but not deleted.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Delete Failed: Caretaker with caretakerID: ${caretakerId} doesn't exist.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (err) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getCaretakersByAvgReview = async (req, res, next) => {
  try {
    let { locationArray } = req.body;
    await caretakerRepository
      .getCaretakersByAvgReview(locationArray)
      .then((caretakersWithAvgReview) => {
        if (caretakersWithAvgReview.length === 0) {
          console.error(
            `No Caretakers were found with review info for location ${locationArray.toString()}`
          );
          return res
            .status(404)
            .send(
              `No Caretakers were found with review info for location ${locationArray.toString()}.`
            );
        }
        console.info(
          `Caretakers with their review data of location: ${locationArray.toString()} were successfully found.`
        );
        return res.status(200).send(caretakersWithAvgReview);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send(
            `There was some error while fetching the caretakers of location: ${locationArray.toString()} with their review data.`
          );
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};
