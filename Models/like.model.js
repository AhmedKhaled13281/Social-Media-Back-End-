const {Schema , model} = require("mongoose")

const LikeSchema = new Schema ({
    user_id : {
        ref : "User",
        type : Schema.Types.ObjectId
    },
    post_id : {
        ref : "Post",
        type : Schema.Types.ObjectId
    },
} , {toJSON : true , toObject : true , timestamps : true})

const LikeModel = model("Like" , LikeSchema)

module.exports = LikeModel