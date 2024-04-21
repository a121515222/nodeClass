require("dotenv").config({ path: ".env.local" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const postsRouter = require("./routes/post");
const usersRouter = require("./routes/user");

const app = express();
const uri = process.env.URI;
const uriLocal = process.env.URI_LOCAL;
mongoose
  .connect(uri)
  .then(() => {
    console.log("連線成功");
  })
  .catch((error) => {
    console.error("連線失敗:", error);
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
  res.status(404).send("Sorry cant find that!");
});
// 錯誤處理
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.stack);
});

const port = 3000;
app.listen(port);
module.exports = app;
