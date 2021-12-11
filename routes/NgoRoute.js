const express = require("express");
const router = express.Router();

const ngoController = require("../controllers/NgoController");

router.post("/", ngoController.addNgo);

router.get("/:id", ngoController.getNgoById);

router.post("/get/review", ngoController.getNgosByAvgReview);

router.put("/:id", ngoController.updateNgoById);

router.delete("/:id", ngoController.deleteNgoById);

module.exports = router;
