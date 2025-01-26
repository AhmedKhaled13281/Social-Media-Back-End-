const express = require("express");
const router = express.Router();
const catchAsync = require("../Utilities/catchAsync");
const userController = require("../Controllers/user.controller");
const commentController = require("../Controllers/comment.controller");

router
  .route("/:postId")
  .post(userController.isAuthorized, catchAsync(commentController.AddComment));

router
  .route("/:commentId")
  .delete(
    userController.isAuthorized,
    catchAsync(commentController.RemoveComment)
  )
  .patch(
    userController.isAuthorized,
    catchAsync(commentController.UpdateComment)
  );

module.exports = router;
