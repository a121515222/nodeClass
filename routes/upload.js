const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const firebaseAdmin = require("../server/firebase");
const bucket = firebaseAdmin.storage().bucket();
const { uploadImage } = require("../utils/images");
const { isAuth, genTokenByJWTAndSend } = require("../utils/auth");
const handleErrorAsync = require("../error/handleErrorAsync");
const { customizeAppError } = require("../error/handleError");
router.post(
  "/uploadPicture",
  isAuth,
  uploadImage,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files.length) {
      next(customizeAppError(400, "需要上傳圖片檔案"));
    }
    // 取得第一個檔案
    const file = req.files[0];
    // blob是準備把檔案上傳至firebase
    // images是要存入這個images資料夾
    // 使用uuid4v產生檔名
    // file.originalname.split(".").pop()留副檔名
    const blob = bucket.file(
      `images/${uuidv4()}.${file.originalname.split(".").pop()}`
    );
    // 建立一個可以寫入 blob 的物件
    const blobStream = blob.createWriteStream();
    // 監聽上傳完成的動作
    blobStream.on("finish", () => {
      //config是參數用來建立檔案的權限與日期
      const config = {
        action: "read",
        expires: "12-31-2500",
      };
      // 取得上傳圖片的Url並傳給前端
      blob.getSignedUrl(config, (err, fileUrl) => {
        res.send({
          fileUrl,
        });
      });
    });
    // 監控上傳錯誤
    blobStream.on("error", (err) => {
      next(customizeAppError(400, "上傳失敗"));
    });
    // 將buffer寫入blobStream，將檔案上傳
    blobStream.end(file.buffer);
  })
);
module.exports = router;
