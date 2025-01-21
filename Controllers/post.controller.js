const postService = require("../Services/post.service");
const AppErrorHandler = require("../Utilities/appErrorHandler");
const LoggerService = require("../Services/logger.service");
const logger = new LoggerService("post.controller");
const { logAudit } = require("../Services/auditing.service");
const multer = require("multer");
const PostModel = require("../Models/post.model");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are Allowed!"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadController = upload.array("photos", 4);

exports.getPosts = async (req, res, next) => {
  const posts = await postService.getPosts();

  if (posts.status) {
    logger.logger.error(posts.message);
    //logAudit()
    res.status(posts.statusCode).json({ message: posts.message });
  }

  res.status(200).json({ length: posts.length, data: posts });
};

exports.createPost = async (req, res, next) => {
  const photos = req.files;
  const body = { photos, ...req.body };

  const post = await postService.createPost(body, req.user);

  if (post.status) {
    logger.logger.error(post.message);
    logAudit({
      action: "Create Post",
      data: body,
      status: "FAILED",
      error: post.message,
      by: req.user?._id,
      ip: req.ip,
    });
    return res.status(post.statusCode).json({ message: post.message });
  }

  logger.logger.info(`Post has been Created : ${post}`);
  logAudit({
    action: "Create Post",
    data: post,
    status: "SUCCESS",
    error: null,
    by: req.user?._id,
    ip: req.ip,
  });
  res.status(200).json({ message: "Post Created Successfully!" });
};

exports.getUserPosts = async (req, res, next) => {
  const { userId } = req.params;
  const userPosts = await postService.getUserPosts(userId);

  if (!userPosts) {
    res.status(userPosts.statusCode).json({ message: userPosts.message });
  }

  res.status(200).json(userPosts);
};

exports.updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const photos = req?.files;
  const body = { ...(photos?.length && { photos }), ...req.body };

  const post = await postService.updatePost(postId, body);

  if (post.status || !body) {
    logger.logger.error(post.message);
    logAudit({
      action: "Update Post",
      data: body,
      status: "FAILED",
      error: post.message,
      by: req.user?._id,
      ip: req.ip,
    });
    return res.status(post.statusCode).json({ message: post.message });
  }

  logger.logger.info(`Post has been Updated : ${post}`);
  logAudit({
    action: "Update Post",
    data: post,
    status: "SUCCESS",
    error: null,
    by: req.user?._id,
    ip: req.ip,
  });

  res.status(200).json(post);
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const post = await postService.deletePost(postId);


  if (post.status || !postId) {
    logger.logger.error(`Post is not found! : ${post}`);
    logAudit({
      action: "DELETE Post",
      data: post,
      status: "FAILED",
      error: post.message,
      by: req.user?._id,
      ip: req.ip,
    });
    res.status(post.statusCode).json({ message: post.message });
  } else {
    logger.logger.info(`Post has been Deleted : ${post}`);
    logAudit({
      action: "Delete Post",
      data: post,
      status: "SUCCESS",
      error: null,
      by: req.user?._id,
      ip: req.ip,
    });
    res.status(200).json({ message: "Post Deleted Successfully!" });
  }
};
