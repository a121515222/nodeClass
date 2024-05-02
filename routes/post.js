const express = require("express");
const router = express.Router();
const Post = require("../models/postModel");
// const User = require("../models/userModel");
const handleErrorAsync = require("../error/handleErrorAsync");
const { customizeAppError } = require("../error/handleError");
router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt";
    const q =
      req.query.q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(q)
      .populate({
        path: "user",
        select: "name photo "
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
    if (post === null) {
      next(customizeAppError(404, "找不到資料"));
    } else {
      res.send(post);
    }
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
  handleErrorAsync(async (req, res, next) => {
    if (!req.params.id) {
      next(customizeAppError(400, "缺少id"));
    } else {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
      });
      res.send(post);
    }
  })
);

router.delete(
  "/:id",
  handleErrorAsync(async (req, res, next) => {
    if (!req.params.id) {
      return next(customizeAppError(400, "缺少id"));
    } else if (req.originalUrl === "/posts/") {
      return next(customizeAppError(400, "缺少id"));
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

router.delete(
  "/",
  handleErrorAsync(async (req, res, next) => {
    if (req.originalUrl === "/posts/") {
      return next(customizeAppError(400, "缺少id"));
    }
  })
);
module.exports = router;
