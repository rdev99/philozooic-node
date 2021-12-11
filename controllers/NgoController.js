const { v4: uuidv4 } = require("uuid");

const Ngo = require("../models/Ngo");
const ngoRepository = require("../repository/NgoRepository");

const ERROR_MESSAGE = "An internal server occurred!";

exports.addNgo = async (req, res, next) => {
  try {
    const {
      name,
      upiId,
      bankIFSC,
      accountNumber,
      phoneNumber,
      about,
      location,
      address,
      picturePath,
    } = req.body;

    let ngo = new Ngo({
      ngoId: uuidv4(),
      name,
      upiId,
      bankIFSC,
      accountNumber,
      phoneNumber,
      location,
      about,
      address,
      picturePath,
    });

    await ngoRepository
      .addNgo(ngo)
      .then((result) => {
        console.info(
          `NGO with ngoId: ${result.ngoId} was successfully added to the database.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was a problem while adding a new NGO to the database.`,
          error
        );
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getNgoById = async (req, res, next) => {
  try {
    let ngoId = req.params.id;

    await ngoRepository
      .getNgoById(ngoId)
      .then((result) => {
        if (result == null) {
          console.error(`NGO with ngoId: ${ngoId} doesn't exist`);
          return res
            .status(404)
            .send(`NGO with ngoId: ${ngoId} doesn't exist!`);
        }
        console.info(
          `NGO with ngoId: ${ngoId} was successfully fetched from the database.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching NGO with ngoId: ${ngoId} from the database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateNgoById = async (req, res, next) => {
  try {
    let nId = req.params.id;
    const { ngoId } = req.body;

    if (nId !== ngoId) {
      console.warn(
        "The ID in the body must be the same as that in the path parameter."
      );
      return res
        .status(400)
        .send(
          "The ID in the body must be the same as that in the path parameter."
        );
    }
    await ngoRepository
      .getNgoById(nId)
      .then(async (result) => {
        if (result === null) {
          console.error(
            `Update Failed: NGO with ngoId: ${ngoId} doesn't exist!`
          );
          return res
            .status(404)
            .send(`Update Failed: NGO with ngoId: ${ngoId} doesn't exist!`);
        }
        await ngoRepository
          .updateNgoById(req.body)
          .then((updatedStatus) => {
            if (
              updatedStatus.nModified >= 0 &&
              updatedStatus.n >= 1 &&
              updatedStatus.ok >= 1
            ) {
              console.info(
                `NGO with ngoId: ${ngoId} was successfully updated.`
              );
              return res.status(200).send(req.body);
            }
            console.error(
              `Update Failed: NGO with ngoId: ${ngoId} was not updated.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Update Failed: NGO with ngoId: ${ngoId} was found but not updated.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching NGO with ngoId: ${ngoId} from the database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deleteNgoById = async (req, res, next) => {
  try {
    let nId = req.params.id;

    await ngoRepository
      .getNgoById(nId)
      .then(async (foundNgo) => {
        if (foundNgo === null) {
          console.error(`Delete Failed: NGO with ngoId: ${nId} doesn't exist.`);
          return res
            .status(404)
            .send(`Delete Failed: NGO with ngoId: ${nId} doesn't exist!`);
        }
        await ngoRepository
          .deleteNgoById(nId)
          .then((result) => {
            if (result.deletedCount > 0) {
              console.info(`NGO with ngoId: ${nId} was successfully deleted.`);
              return res.status(200).send(foundNgo);
            }
            console.error(
              `Delete Failed: NGO with ngoId: ${nId} was not deleted.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Delete Failed: NGO with ngoId: ${nId} was found but not deleted.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching NGO with ngoId: ${ngoId} from the database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (err) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getNgosByAvgReview = async (req, res, next) => {
  try {
    let { locationArray, ngoId } = req.body;
    await ngoRepository
      .getNgosByAvgReview(locationArray, ngoId)
      .then((ngosWithAvgReview) => {
        if (ngosWithAvgReview.length === 0) {
          console.error(
            `No NGOs were found with review info for location ${locationArray.toString()}`
          );
          return res
            .status(404)
            .send(
              `No NGOs were found with review info for location ${locationArray.toString()}.`
            );
        }
        console.info(
          `NGOs with their review data of location: ${locationArray.toString()} were successfully found.`
        );
        return res.status(200).send(ngosWithAvgReview);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send(
            `There was some error while fetching the NGOs of location: ${locationArray.toString()} with their review data.`
          );
      });
  } catch (error) {
    return res.stats(500).send(ERROR_MESSAGE);
  }
};
