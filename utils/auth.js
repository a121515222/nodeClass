const handleErrorAsync = require("../error/handleErrorAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { customizeAppError } = require("../error/handleError");
const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(customizeAppError(401, "尚未登入，請重新登入"));
  }
  const decode = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRETWORD, (err, payload) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(payload);
      }
    });
  });

  // const decode = await jwt.verify(token, process.env.SECRETWORD);
  const authUser = await User.findById(decode._id);
  req.user = authUser;
  next();
});
const genTokenByJWTAndSend = (user, res) => {
  const { _id, nickName, email } = user;
  const token = jwt.sign({ _id }, process.env.SECRETWORD, { expiresIn: "7d" });
  res.send({
    status: true,
    user: {
      token,
      nickName: nickName ? nickName : "",
      email,
    },
  });
};
module.exports = { isAuth, genTokenByJWTAndSend };
