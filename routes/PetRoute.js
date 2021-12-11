const express = require("express");
const router = express.Router();

const petController = require("../controllers/PetController");

router.post("/", petController.addPet);

router.get("/:id", petController.getPetById);

router.post("/get/review", petController.getPetsByAvgReview);

router.put("/:id", petController.updatePetById);

router.delete("/:id", petController.deletePetById);

router.get("/by_owner/:ownerId", petController.getPetsByOwnerId);

module.exports = router;
