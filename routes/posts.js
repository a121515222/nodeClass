const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const returnErrorMessage = require("../error/errorMessage");

router.get("/", async function (req, res) {
  const posts = await Post.find().limit(30);
  res.send(posts);
});
router.get("/:id", async function (req, res) {
  const post = await Post.findById(req.params.id);
  res.send(post);
});
router.post("/", async function (req, res) {
  try {
    const post = await Post.create(req.body);
    console.log("post", post);
    res.send(post);
  } catch (error) {
    returnErrorMessage(error, res);
  }
});
router.put("/:id", async function (req, res) {
  if (!req.params.id) {
    return res.status(400).send("請輸入id");
  } else {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
      });
      res.send(post);
    } catch (error) {
      returnErrorMessage(error, res);
    }
  }
});
router.delete("/:id", async function (req, res) {
  if (!req.params.id) {
    return res.status(400).send("請輸入id");
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
module.exports = router;
