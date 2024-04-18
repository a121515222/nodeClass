const express = require("express");
require("dotenv").config({ path: ".env" });
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const postsRouter = require("./routes/posts");

const app = express();
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
const port = 3000;
app.listen(port);
module.exports = app;
