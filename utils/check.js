const validator = require("validator");
const { customizeAppError } = require("../error/handleError");
const checkPasswordSignUp = (next, password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return next(customizeAppError(406, "請輸入密碼與確認密碼"));
  }
  if (password !== confirmPassword) {
    return next(customizeAppError(406, "密碼與確認密碼不相同"));
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(customizeAppError(406, "請輸入八碼密碼"));
  }
};

const checkPasswordSignIn = (next, password) => {
  if (!password) {
    return next(customizeAppError(406, "請輸入密碼與確認密碼"));
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(customizeAppError(406, "請輸入八碼密碼"));
  }
};

const checkEmail = (next, email) => {
  if (!email) {
    return next(customizeAppError(406, "請輸入email"));
  }
  if (!validator.isEmail(email)) {
    return next(customizeAppError(406, "請按照email格式輸入"));
  }
};

module.exports = { checkPasswordSignUp, checkPasswordSignIn, checkEmail };
