const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/DoctorController");

router.post("/", doctorController.addDoctor);

router.get("/:id", doctorController.getDoctorById);

router.get("/get/all", doctorController.getAllDoctors);

router.post("/get/review", doctorController.getDoctorsByAvgReview);

router.put("/:id", doctorController.updateDoctorById);

router.delete("/:id", doctorController.deleteDoctorById);

module.exports = router;
