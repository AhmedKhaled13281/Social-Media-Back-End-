const commentService = require("../Services/comment.service");

const LoggerService = require("../Services/logger.service");
const logger = new LoggerService("comment.controller");
const { logAudit } = require("../Services/auditing.service");

exports.AddComment = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { text } = req.body;

  const addComment = await commentService.AddComment(postId, userId, text);

  if (!postId || addComment.status) {
    logger.logger.error(addComment.message);
    logAudit({
      action: "Add Comment to Post",
      data: `Post ID : ${postId}`,
      status: "FAILED",
      error: addComment.message,
      by: req.user?._id,
      ip: req.ip,
    });
    return res.status(405).json({ message: addComment.message });
  }

  logger.logger.info(addComment);
  logAudit({
    action: "Add Comment to Post",
    data: addComment,
    status: "SUCCESS",
    error: null,
    by: req.user?._id,
    ip: req.ip,
  });

  res
    .status(200)
    .json({ message: `Comment added successfully to this post : ${postId}` });
};

exports.RemoveComment = async (req, res, next) => {
  const { commentId } = req.params;

  const removeComment = await commentService.RemoveComment(commentId);

  if (!commentId || removeComment.status) {
    logger.logger.error(removeComment.message);
    logAudit({
      action: "Remove Comment to Post",
      data: `Comment ID : ${commentId}`,
      status: "FAILED",
      error: removeComment.message,
      by: req.user?._id,
      ip: req.ip,
    });
    return res.status(405).json({ message: removeComment.message });
  }

  logger.logger.info(removeComment);
  logAudit({
    action: "Remove Comment to Post",
    data: removeComment,
    status: "SUCCESS",
    error: null,
    by: req.user?._id,
    ip: req.ip,
  });

  res
    .status(200)
    .json({ message: `Comment Deleted successfully` });
};

exports.UpdateComment = async (req, res, next) => {
  const { commentId } = req.params;
  const { text } = req.body;

  const updateComment = await commentService.UpdateComment(commentId, text);

  if (!commentId || updateComment.status) {
    logger.logger.error(updateComment.message);
    logAudit({
      action: "Update Comment to Post",
      data: `Comment ID : ${postId}`,
      status: "FAILED",
      error: updateComment.message,
      by: req.user?._id,
      ip: req.ip,
    });
    return res.status(405).json({ message: updateComment.message });
  }

  logger.logger.info(updateComment);
  logAudit({
    action: "Update Comment to Post",
    data: updateComment,
    status: "SUCCESS",
    error: null,
    by: req.user?._id,
    ip: req.ip,
  });

  res
    .status(200)
    .json({ message: `Comment has been updated!` });
};
