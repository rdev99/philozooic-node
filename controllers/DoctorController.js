const { v4: uuidv4 } = require("uuid");

const Doctor = require("../models/Doctor");
const doctorRepository = require("../repository/DoctorRepository");

const ERROR_MESSAGE = "An internal server occurred!";

exports.addDoctor = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      specialty,
      picturePath,
      address,
    } = req.body;

    let doctor = new Doctor({
      doctorId: uuidv4(),
      firstName,
      lastName,
      about,
      charge,
      chargeDuration,
      location,
      specialty,
      picturePath,
      address,
    });

    await doctorRepository
      .addDoctor(doctor)
      .then((result) => {
        console.info(
          `Doctor with doctorId: ${result.doctorId} was successfully added to the database.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was an error while adding the doctor to the database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    let doctorId = req.params.id;

    await doctorRepository
      .getDoctorById(doctorId)
      .then((result) => {
        if (result == null) {
          console.error(`Doctor with doctorId: ${doctorId} was not found.`);
          return res
            .status(404)
            .send(`Doctor with ID: ${doctorId} doesn't exist!`);
        }
        console.info(
          `Doctor with doctorId: ${doctorId} was successfully found.`
        );
        return res.status(200).send(result);
      })
      .catch((error) => {
        console.error(
          `There was an error while fetching doctor with doctorId: ${doctorId} from the database.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getAllDoctors = async (req, res, next) => {
  try {
    await doctorRepository
      .getAllDoctors()
      .then((foundDoctors) => {
        if (foundDoctors.length === 0) {
          console.error(`No doctors are present in the database.`);
          return res.status(404).send("No doctors were found!");
        }
        console.info(`All doctors were fetched successfully.`);
        return res.status(200).send(foundDoctors);
      })
      .catch((error) => {
        console.error(
          "There was an error while fetching all the doctors from the database.",
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.updateDoctorById = async (req, res, next) => {
  try {
    let docId = req.params.id;
    const { doctorId } = req.body;

    if (docId !== doctorId) {
      console.warn(
        "The ID in the body must be the same as that in the path parameter."
      );
      return res
        .status(400)
        .send(
          "The ID in the body must be the same as that in the path parameter."
        );
    }
    await doctorRepository
      .getDoctorById(docId)
      .then(async (result) => {
        if (result == null) {
          return res
            .status(404)
            .send(`Doctor with ID: ${doctorId} doesn't exist!`);
        }
        await doctorRepository
          .updateDoctorById(req.body)
          .then((updatedStatus) => {
            if (
              updatedStatus.nModified >= 0 &&
              updatedStatus.n >= 1 &&
              updatedStatus.ok >= 1
            ) {
              return res.status(200).send(req.body);
            }
            console.error(
              `Update failed: Doctor with doctorId: ${doctorId} was not updated.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Update failed: Doctor with doctorId: ${doctorId} was found but not updated.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Update failed: Doctor with doctorId: ${doctorId} doesn't exist.`,
          error
        );
        return res.status(500).send(ERROR_MESSAGE);
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.deleteDoctorById = async (req, res, next) => {
  try {
    let docId = req.params.id;

    await doctorRepository
      .getDoctorById(docId)
      .then(async (foundDoctor) => {
        if (foundDoctor == null) {
          console.error(
            `Delete Failed: Doctor with doctorId: ${docId} was not found.`
          );
          return res
            .status(404)
            .send(`Doctor with ID: ${docId} doesn't exist!`);
        }
        await doctorRepository
          .deleteDoctorById(docId)
          .then((result) => {
            if (result.deletedCount > 0) {
              console.info(
                `Doctor with doctorId: ${docId} was successfully deleted.`
              );
              return res.status(200).send(foundDoctor);
            }
            console.error(
              `Delete Failed: Doctor with doctorId: ${docId} was not deleted.`
            );
            return res.status(500).send(ERROR_MESSAGE);
          })
          .catch((error) => {
            console.error(
              `Delete Failed: Doctor with doctorId: ${docId} was found but not deleted.`,
              error
            );
            return res.status(500).send(ERROR_MESSAGE);
          });
      })
      .catch((error) => {
        console.error(
          `Delete Failed: Doctor with doctorId: ${doctorId} doesn't exist.`,
          error
        );
      });
  } catch (err) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};

exports.getDoctorsByAvgReview = async (req, res, next) => {
  try {
    let { locationArray, doctorId } = req.body;
    await doctorRepository
      .getDoctorsByAvgReview(locationArray, doctorId)
      .then((doctorsWithAvgReview) => {
        if (doctorsWithAvgReview.length === 0) {
          console.error(
            `No Doctors were found with review info for location ${locationArray.toString()}`
          );
          return res
            .status(404)
            .send(
              `No Doctors were found with review info for location ${locationArray.toString()}.`
            );
        }
        console.info(
          `Doctors with their review data of location: ${locationArray.toString()} were successfully found.`
        );
        return res.status(200).send(doctorsWithAvgReview);
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(500)
          .send(
            `There was some error while fetching the doctors of location: ${locationArray.toString()} with their review data.`
          );
      });
  } catch (error) {
    return res.status(500).send(ERROR_MESSAGE);
  }
};
