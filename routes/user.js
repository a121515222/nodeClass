const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const returnErrorMessage = require("../error/errorMessage");

router.post("/", async function (req, res) {
  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    returnErrorMessage(error, res);
  }
});

module.exports = router;
