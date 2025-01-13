const { Schema, model } = require("mongoose");

const PostSchema = new Schema(
  {
    user_id: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    photos: {
      type: [String],
    },
  },
  { toJson: { virtual: true }, toObject: { virtual: true }, timestamps: true }
);

const PostModel = model("post", PostSchema);

module.exports = PostModel;
