const express = require("express");
const isLoggedIn = require("../middleware/isLogged");
const router = express.Router();

const userController = require("../controllers/UserController");

router.post("/signup", userController.addUser);

router.post("/login", userController.loginUser);

router.get("/user/:id", userController.getUserById);

router.get("/user-target/:targetUserId", userController.getUserByTargetUserId);

router.put("/user/:id", isLoggedIn, userController.updateUserById);

module.exports = router;
