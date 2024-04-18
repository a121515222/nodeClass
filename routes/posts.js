const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.get("/", async function (req, res) {
  const posts = await Post.find().limit(30);
  res.send(posts);
});

router.post("/", async function (req, res) {
  console.log("req.body", req.body);
  const post = new Post(req.body);
  await post.save();
  res.send(post);
});
router.put("/:id", async function (req, res) {
  const post = await Post.findById(req.params.id);
  // post.set(req.body);
  await post.save();
  res.send(post);
});
router.delete("/:id", async function (req, res) {
  const post = await Post.findByIdAndDelete(req.params.id);
  res.send(post);
});
module.exports = router;
