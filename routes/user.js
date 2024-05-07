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

const genTokenByJWTAndSend = (user, res) => {
  const { _id, nickName, email } = user;
  const token = jwt.sign({ _id }, process.env.SECRETWORD);
  res.send({
    status: true,
    user: {
      token,
      nickName: nickName ? nickName : "",
      email,
    },
  });
};

router.post(
  "/sign_up",
  handleErrorAsync(async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;
    //檢查email
    checkEmail(email);
    //檢查password
    checkPasswordSignUp(password, confirmPassword);

    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);

    req.body.password = await bcrypt.hash(req.body.password, 12);
    const user = await User.create(req.body);
    genTokenByJWTAndSend(user, res);
    next();
  })
);

router.post(
  "/sign_in",
  handleErrorAsync(async (req, res, next) => {
    const { email, password } = req.body;
    checkPasswordSignIn(password);
    checkEmail(email);
    const loginUser = await User.findOne({ email }).select("+password");
    const isAuth = await bcrypt.compare(password, loginUser.password);
    if (!isAuth) {
      next(customizeAppError(406, "密碼不正確"));
    } else {
      genTokenByJWTAndSend(loginUser, res);
    }
  })
);

module.exports = router;
