const { Schema, model } = require("mongoose");
const UserModel = require("./user.model");

const CommentSchema = new Schema(
  {
    user_id: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    user_picture: {
      type: String,
    },
    user_username: {
      type: String,
    },
    post_id: {
      ref: "Post",
      type: Schema.Types.ObjectId,
    },
    date: {
      type: String,
    },
    text: {
      type: String,
      required: true,
      validate : {
        validator : function (val) {
          if(!val) return false
        },
        message : (props) => `${props.val}`
      }
    },
  },
  { toJSON: true, toObject: true }
);

CommentSchema.pre("save", async function (next) {
  const user = await UserModel.findOne({ _id: this.user_id });
  this.user_picture = user?.profilePicture;
  this.user_username = user?.username;

  if (!this.date) {
    this.date = new Date(Date.now()).toLocaleString("en-GB");
  }

  next();
});

const CommentModel = model("Comment", CommentSchema);

module.exports = CommentModel;
