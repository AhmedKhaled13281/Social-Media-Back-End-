const PostModel = require("../Models/post.model");
const AppErrorHandler = require("../Utilities/appErrorHandler");
const filterReqBody = require("../Utilities/filterReqBody");

exports.getPosts = async () => {
  const posts = await PostModel.find();

  if (!posts) {
    return new AppErrorHandler("There is no Posts!", 404);
  }

  return posts;
};

exports.createPost = async (data, user) => {
  const filteredData = filterReqBody(data, ["title", "description"]);

  const post = await PostModel.create({
    user_id: user._id,
    title: filteredData.title,
    description: filteredData.description,
  });

  return post
};
