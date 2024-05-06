const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const handleErrorAsync = require("../error/handleErrorAsync");
const { customizeAppError } = require("../error/handleError");
router.post(
  "/",
  handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;
    console.log("req.body", req.body);
    //檢查email
    if (!email) {
      return next(customizeAppError(406, "請輸入email"));
    }
    if (!validator.isEmail(email)) {
      return next(customizeAppError(406, "請按照email格式輸入"));
    }
    if (!password || !confirmPassword) {
      return next(customizeAppError(406, "請輸入密碼與確認密碼"));
    }
    if (password !== confirmPassword) {
      return next(customizeAppError(406, "密碼與確認密碼不相同"));
    }
    if (!validator.isLength(password, { min: 8 })) {
      return next(customizeAppError(406, "請輸入八碼密碼"));
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    req.body.password = hash;
    const user = await User.create(req.body);
    const { _id } = user;

    const token = jwt.sign({ _id }, process.env.SECRETWORD);

    res.send({
      status: true,
      token,
    });
    next();
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
