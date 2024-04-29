require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const postsRouter = require("./routes/post");
const usersRouter = require("./routes/user");
const handleError = require("./error/handleError");
const app = express();

//記錄錯誤
process.on("uncaughtException", (err) => {
  console.log("uncaughtException");
  console.log(err);
  process.exit(1);
});

app.use(function (req, res, next) {
  console.log("連線者驗證成功");
  next();
});
const uri = process.env.URI;

mongoose.connect(uri).then(() => {
  console.log("連線成功");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/posts", postsRouter);
app.use("/users", usersRouter);
// 找不到routes時，回傳404
app.use(function (req, res, next) {
  res.status(404).json({
    status: false,
    message: "找不到Url",
  });
});
// 錯誤處理
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV === "dev") {
    res.status(500).json({
      status: false,
      message: err,
    });
  } else {
    const message = handleError(err);
    res.status(500).json({
      status: false,
      message,
    });
  }
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的rejection:", promise, "原因:", reason);
});

// const port = 8080;
// app.listen(port);
module.exports = app;
