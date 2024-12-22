const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user.controller");
const catchAsync = require("../Utilities/catchAsync");

router.route("/signup").post(catchAsync(userController.userSignUp));

router.route("/signin").post(catchAsync(userController.userSignIn));

router
  .route("/updateProfile")
  .patch(
    userController.isAuthorized,
    catchAsync(userController.updateUserProfile)
  );

module.exports = router;
