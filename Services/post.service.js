const PostModel = require("../Models/post.model");
const UserModel = require("../Models/user.model")
const AppErrorHandler = require("../Utilities/appErrorHandler");
const filterReqBody = require("../Utilities/filterReqBody");
const uploadToFirebase = require("../Utilities/uploadImgToFireBase")

exports.getPosts = async () => {
  const posts = await UserModel.aggregate([
    {
      $lookup: {
        from : 'posts',
        localField: '_id',
        foreignField : 'user_id',
        as : 'posts',
      },
    },
    {
      $project : {
        password : 0,
        createdAt : 0,
        updatedAt : 0,
        __v : 0
      }
    }
  ])

  if (!posts) {
    return new AppErrorHandler("There is no Posts!", 404);
  }

  return posts;
};

exports.createPost = async (data, user) => {
  const filteredData = filterReqBody(data, ["title", "description"]);

  const images = await uploadToFirebase(data.photos)

  const post = await PostModel.create({
    user_id: user._id,
    title: filteredData.title,
    description: filteredData.description,
    photos : images
  });

  return post
};

exports.getUserPosts = async (userId) => {
  const posts = await PostModel.find({user_id : userId})

  if(!posts) {
    return new AppErrorHandler("No Posts For This User!" , 404)
  }

  return posts
}

// TODO
exports.updatePost = async (postId , data) => {

  if(!post || !postId) {
    return new AppErrorHandler("There is no Post" , 404)
}
}