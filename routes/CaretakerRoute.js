const express = require("express");
const router = express.Router();

const caretakerController = require("../controllers/CaretakerController");

router.post("/", caretakerController.addCaretaker);

router.get("/:id", caretakerController.getCaretakerById);

router.post("/get/review", caretakerController.getCaretakersByAvgReview);

router.put("/:id", caretakerController.updateCaretakerById);

router.delete("/:id", caretakerController.deleteCaretakerById);

module.exports = router;
