const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const handleErrorAsync = require("../error/handleErrorAsync");

router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.send(user);
  })
);

router.get(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const users = await User.find();
    res.send(users);
  })
);

module.exports = router;
