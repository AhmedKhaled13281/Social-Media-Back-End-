const express = require("express");
const router = express.Router();
const catchAsync = require("../Utilities/catchAsync");
const userController = require("../Controllers/user.controller");
const likeController = require("../Controllers/like.controller");

router
  .route("/:postId")
  .post(userController.isAuthorized, catchAsync(likeController.AddLike))
  .delete(userController.isAuthorized, catchAsync(likeController.RemoveLike));

module.exports = router;
