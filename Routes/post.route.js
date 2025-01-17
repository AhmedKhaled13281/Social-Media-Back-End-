const express = require("express");
const router = express.Router();
const catchAsync = require("../Utilities/catchAsync");
const userController = require("../Controllers/user.controller");
const postController = require("../Controllers/post.controller");

router
  .route("/")
  .post(
    userController.isAuthorized,
    postController.uploadController,
    catchAsync(postController.createPost)
  )
  .get(catchAsync(postController.getPosts));

router
  .route("/:userId")
  .get(userController.isAuthorized, catchAsync(postController.getUserPosts));

router
  .route("/:postId")
  .patch(
    userController.isAuthorized,
    postController.uploadController,
    catchAsync(postController.updatePost)
  )
  .delete(userController.isAuthorized, catchAsync(postController.deletePost));

module.exports = router;
