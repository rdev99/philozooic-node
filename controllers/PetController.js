const { v4: uuidv4 } = require("uuid");

const Pet = require("../models/Pet");
const petRepository = require("../repository/PetRepository.js");

const ERROR_MESSAGE = "An internal server error occurred";

exports.addPet = async (req, res, next) => {
  try {
    const {
      animalType,
      name,
      breed,
      ownerId,
      location,
      medicalHistory,
      mateStatus,
      picturePath,
      gender,
      age,
    } = req.body;

    let pet = new Pet({
      petId: uuidv4(),
      name,
      animalType,
      breed,
      ownerId,
      location,
      medicalHistory,
      mateStatus,
      picturePath,
      gender,
      age,
    });

    await petRepository
      .addPet(pet)
      .then((result) => {
        console.info(
          `Pet with petId: ${result.petId} was successfully added to the database.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          "There was an error while adding a new pet to the database.",
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getPetById = async (req, res, next) => {
  try {
    let petId = req.params.id;

    await petRepository
      .getPetById(petId)
      .then((result) => {
        if (result == null) {
          console.error(`Pet with petId: ${petId} doesn't exist.`);
          return res
            .status(404)
            .send(`Pet with petId: ${petId} doesn't exist!`);
        }
        console.info(`Pet with petId: ${petId} was successfully found.`);
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching pet with petId: ${petId} from the database`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updatePetById = async (req, res, next) => {
  try {
    let pId = req.params.id;
    const { petId } = req.body;

    if (pId !== petId) {
      console.warn(
        "The ID in the body must be the same as that in the path parameter."
      );
      return res
        .status(400)
        .send(
          "The ID in the body must be the same as that in the path parameter."
        );
    }
    await petRepository
      .getPetById(pId)
      .then(async (result) => {
        if (result === null) {
          console.error(
            `Update Failed: Pet with petId: ${petId} doesn't exist.`
          );
          return res
            .status(404)
            .send(`Pet with petId: ${petId} doesn't exist!`);
        }
        await petRepository
          .updatePetById(req.body)
          .then(async (updatedStatus) => {
            if (
              updatedStatus.nModified >= 0 &&
              updatedStatus.n >= 1 &&
              updatedStatus.ok >= 1
            ) {
              console.info(
                `Pet with petId: ${petId} was successfully updated.`
              );
              return res.status(200).send(req.body);
            }
            console.error(
              `Update Failed: Pet with petId: ${petId} was not updated.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Update Failed: Pet with petId: ${petId} was found but not updated.`,
              error
            );
          });
      })
      .catch((error) => {
        console.error(
          `There was a problem while fetching pet with petId: ${petId} from the database`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deletePetById = async (req, res, next) => {
  try {
    let pId = req.params.id;

    await petRepository
      .getPetById(pId)
      .then(async (foundPet) => {
        if (foundPet === null) {
          console.error(`Delete Failed: Pet with petId: ${pId} doesn't exist!`);
          return res.status(404).send(`Pet with petId: ${pId} doesn't exist!`);
        }
        await petRepository
          .deletePetById(pId)
          .then((result) => {
            if (result.deletedCount > 0) {
              console.info(
                `Pet with petId: ${petId} was successfully deleted.`
              );
              return res.status(200).send(foundPet);
            }
            console.error(
              `Delete Failed: Pet with petId: ${petId} was not deleted.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Delete Failed: Pet with petId: ${petId} was found but not deleted`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching pet with petId: ${petId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getPetsByOwnerId = async (req, res, next) => {
  try {
    let ownerId = req.params.ownerId;
    await petRepository
      .getPetsByOwnerId(ownerId)
      .then((petsOfOwner) => {
        if (petsOfOwner.length === 0) {
          console.error(`No pets were found with ownerId: ${ownerId}`);
          return res
            .status(404)
            .send(`Pets with Owner ID: ${ownerId} don't exist!`);
        }
        console.info(`Pets with ownerId: ${ownerId} were successfully found.`);
        return res.status(200).send(petsOfOwner);
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching pets with ownerId: ${ownerId}`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getPetsByAvgReview = async (req, res, next) => {
  try {
    let mateStatusBoolean = req.query.mateStatus;
    let { locationArray, petId } = req.body;
    await petRepository
      .getPetsByAvgReview(locationArray, mateStatusBoolean, petId)
      .then((petsWithAvgReview) => {
        if (petsWithAvgReview.length === 0) {
          console.error(
            `No Pets were found with review info for location ${locationArray.toString()} and mateStatus: ${mateStatusBoolean}`
          );
          return res
            .status(404)
            .send(
              `No Pets were found with review info for location ${locationArray.toString()} and mateStatus: ${mateStatusBoolean}.`
            );
        }
        console.info(
          `Pets with their review data of location: ${locationArray.toString()} and mateStatus: ${mateStatusBoolean} were successfully found.`
        );
        return res.status(200).send(petsWithAvgReview);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send(
            `There was some error while fetching the Pets of location: ${locationArray.toString()} and mateStatus: ${mateStatusBoolean} with their review data.`
          );
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};
