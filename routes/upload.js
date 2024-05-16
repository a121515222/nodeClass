const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/auth");
router.post(
  "/uploadPicture",
  isAuth,
  upload.single("picture"),
  handleErrorAsync(async (req, res, next) => {})
);
