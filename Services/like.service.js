const AppErrorHandler = require("../Utilities/appErrorHandler");
const LikeModel = require("../Models/like.model");

exports.AddLike = async (postId, userId) => {
  const existedLike = await LikeModel.findOne({
    post_id: postId,
    user_id: userId,
  });
  if (existedLike) {
    return new AppErrorHandler(
      `This post already you have liked it : ${postId}`,
      405
    );
  }

  const addLike = await LikeModel.create({
    user_id: userId,
    post_id: postId,
  });

  if (!addLike) {
    return new AppErrorHandler(
      `There is an Error when like with this post : ${postId}`,
      405
    );
  }

  return addLike;
};

exports.RemoveLike = async (postId, userId) => {
  const removeLike = await LikeModel.deleteOne({
    post_id: postId,
    user_id : userId
  });

  if (!postId || removeLike.deletedCount == 0) {
    return new AppErrorHandler(
      `There is an Error when like with this post Or this Like has been removed already : ${postId}`,
      405
    );
  }

  return removeLike;
};
