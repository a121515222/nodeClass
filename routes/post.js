const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
// const User = require("../models/userModel");
const returnErrorMessage = require("../error/errorMessage");
const handleErrorAsync = require("../error/handleErrorAsync");
const customizeAppError = require("../error/customizeAppError");
router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo ",
      })
      .sort(timeSort)
      .select("content image user likes createdAt");
    res.send(post);
  })
);
router.get(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.send(post);
  })
);

router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const post = await Post.create(req.body);
    res.send(post);
  })
);

router.put(
  "/:id",
  handleErrorAsync(async (res, req, next) => {
    if (!req.params.id) {
      customizeAppError(400, "缺少id");
    } else {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
      });
      res.send(post);
    }
  })
);

router.delete("/:id", async function (req, res) {
  console.log("req.originalUrl", req.originalUrl);
  if (!req.params.id) {
  } else if (req.originalUrl === "/posts/") {
    customizeAppError(400, "缺少id");
  } else {
    try {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (post === null) {
        res.status(404).send("找不到資料");
      } else {
        res.send(`已成功刪除資料`);
      }
    } catch (error) {
      returnErrorMessage(error, res);
    }
  }
});

router.delete(
  "/:id",
  handleErrorAsync(async (res, req, next) => {
    if (!req.params.id) {
      return res.status(400).send("請輸入id");
    } else if (req.originalUrl === "/posts/") {
      return res.status(400).send("請輸入id");
    } else {
      const post = await Post.findByIdAndDelete(req.params.id);
      if (post === null) {
        res.status(404).send("找不到資料");
      } else {
        res.send(`已成功刪除資料`);
      }
    }
  })
);
module.exports = router;
