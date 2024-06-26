const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const handleErrorAsync = require("../error/handleErrorAsync");
const { customizeAppError } = require("../error/handleError");
const {
  checkEmail,
  checkPasswordSignUp,
  checkPasswordSignIn,
} = require("../utils/check");
const { genTokenByJWTAndSend } = require("../utils/auth");
const { isAuth } = require("../utils/auth");

router.post(
  "/sign_up",
  handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;
    //檢查email
    checkEmail(next, email);
    //檢查password
    checkPasswordSignUp(password, confirmPassword, next);

    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    genTokenByJWTAndSend(user, res);
    next();
  })
);

router.post(
  "/sign_in",
  handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    checkPasswordSignIn(next, password);
    checkEmail(next, email);
    const loginUser = await User.findOne({ email }).select("+password");
    if (!loginUser) {
      next(customizeAppError(400, "找不到使用者"));
    }
    const isPass = await bcrypt.compare(password, loginUser.password);
    if (!isPass) {
      next(customizeAppError(406, "密碼不正確"));
    } else {
      genTokenByJWTAndSend(loginUser, res);
    }
  })
);

router.put(
  "/updatePassword",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { confirmPassword, newPassword } = req.body;
    checkPasswordSignUp(newPassword, confirmPassword, next);
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const { _id } = req.user;
    const updatePassword = await User.findByIdAndUpdate(
      _id,
      {
        password: hashPassword,
      },
      { new: true }
    ).select("+password");
    if (updatePassword.password === hashPassword) {
      res.status(200).json({
        status: true,
        message: "密碼修改成功",
      });
    } else {
      next(customizeAppError(400, "修改密碼失敗"));
    }
  })
);
router.get(
  "/profile",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { _id } = req.user;
    const userProfile = await User.findById(_id);
    res.status(200).json({
      status: true,
      data: userProfile,
    });
  })
);

router.put(
  "/profile",
  isAuth,
  handleErrorAsync(async (req, res, next) => {
    const { _id } = req.user;
    console.log("req", req.body);
    const { email } = req.body;
    if (email) {
      checkEmail(next, email);
    }
    const userUpdateProfile = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: true,
      data: userUpdateProfile,
    });
  })
);

module.exports = router;
