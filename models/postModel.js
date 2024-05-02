const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Content需填寫"]
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "userId需填寫"],
      ref: "user"
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { versionKey: false }
);
const Post = mongoose.model("post", postSchema);
module.exports = Post;
