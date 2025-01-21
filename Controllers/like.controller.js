const likeService = require("../Services/like.service")

const LoggerService = require("../Services/logger.service");
const logger = new LoggerService("like.controller");
const { logAudit } = require("../Services/auditing.service");

exports.AddLike = async (req , res , next) => {
    const {postId} = req.params
    const userId = req.user._id

    const addLike = await likeService.AddLike(postId , userId)

    if(addLike.status || !postId) {
        logger.logger.error(addLike.message);
        logAudit({
          action: "Add Like to Post",
          data: `Post ID : ${postId}`,
          status: "FAILED",
          error: addLike.message,
          by: req.user?._id,
          ip: req.ip,
        });
        return res.status(405).json({message : addLike.message})
    }

    logger.logger.info(addLike.message);
    logAudit({
      action: "Add Like to Post",
      data: `Post ID : ${postId}`,
      status: "SUCCESS",
      error: null,
      by: req.user?._id,
      ip: req.ip,
    });

    res.status(200).json({message : `Like added successfully to this post : ${postId}`})
}

exports.RemoveLike = async (req , res , next) => {
    const {postId} = req.params
    const userId = req.user._id

    const removeLike = await likeService.RemoveLike(postId , userId)

    if(removeLike.status || !postId) {
        logger.logger.error(removeLike.message);
        logAudit({
          action: "Remove Like to Post",
          data: `Post ID : ${postId}`,
          status: "FAILED",
          error: removeLike.message,
          by: req.user?._id,
          ip: req.ip,
        });
        return res.status(405).json({message : removeLike.message})
    }

    logger.logger.info(removeLike.message);
    logAudit({
      action: "Remove Like to Post",
      data: `Post ID : ${postId}`,
      status: "SUCCESS",
      error: null,
      by: req.user?._id,
      ip: req.ip,
    });

    res.status(200).json({message : `Like has been DELETED to this post : ${postId}`})
    
}