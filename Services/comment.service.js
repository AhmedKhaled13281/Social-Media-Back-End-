const CommentModel = require("../Models/comment.model");
const AppErrorHandler = require("../Utilities/appErrorHandler");

exports.AddComment = async (postId, userId, text) => {
  const addComment = await CommentModel.create({
    user_id: userId,
    post_id: postId,
    text: text,
  });

  if (!addComment) {
    return new AppErrorHandler(
      `There is an Error when comment with this post : ${postId}`,
      400
    );
  }

  return addComment;
};

exports.RemoveComment = async (commentId) => {
  const removeComment = await CommentModel.deleteOne({
    _id: commentId,
  });

  if (!removeComment) {
    return new AppErrorHandler(
      `There is an Error when comment with this post : ${postId}`,
      400
    );
  }

  return removeComment;
};

exports.UpdateComment = async (commentId, text) => {
  const updateComment = await CommentModel.findByIdAndUpdate(
    {
      _id: commentId,
    },
    { text: text },
    { runValidators: true }
  );

  if (!updateComment) {
    return new AppErrorHandler(
      `There is an Error when comment with this post : ${postId}`,
      400
    );
  }

  return updateComment;
};
