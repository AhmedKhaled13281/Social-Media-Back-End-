const express = require("express");
const router = express.Router();
const catchAsync = require("../Utilities/catchAsync");
const userController = require("../Controllers/user.controller");
const postController = require("../Controllers/post.controller");

router
  .route("/")
  .post(userController.isAuthorized, postController.createPost)
  .get(postController.getPosts);

module.exports = router;
