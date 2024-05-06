const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "缺少Email"],
      unique: true,
      lowercase: true,
      select: false,
      unique: true, //唯一值，有相同的email註冊時會報錯
    },
    password: {
      type: String,
      required: [true, "缺少password"],
    },
    nickName: {
      type: String,
    },
  },
  { versionKey: false }
);
const User = mongoose.model("user", userSchema);

module.exports = User;
