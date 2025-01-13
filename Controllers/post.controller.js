const postService = require("../Services/post.service")
const AppErrorHandler = require("../Utilities/appErrorHandler");
const LoggerService = require("../Services/logger.service");
const logger = new LoggerService("post.controller");
const { logAudit } = require("../Services/auditing.service");

exports.getPosts = async (req , res , next) => {
    const posts = await postService.getPosts()

    if(posts.status) {
        logger.logger.error(posts.message)
        //logAudit()
        res.status(posts.statusCode).json({message : posts.message})
    }

    res.status(200).json({length : posts.length , data : posts})
}

exports.createPost = async (req , res , next) => {
    const posts = await postService.createPost(req.body , req.user)

    if(posts.status) {
        logger.logger.error(posts.message)
        logAudit({    action: "Create Post",
        data: req.body,
        status: "FAILED",
        error: null,
        by: req.user?._id,
        ip: req.ip,})
        res.status(posts.statusCode).json({message : posts.message})
    }

    res.status(200).json({message : "Post Created Successfully!"})
}