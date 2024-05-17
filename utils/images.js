const multer = require("multer");
const path = require("path");
const uploadImage = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".png" && ext !== ".jpeg") {
      cb(new Error("僅限上傳 jpg、jpeg、png檔"));
    }
    cb(null, true);
  },
}).any();
// .any 會自動把把上傳file帶到req內

module.exports = { uploadImage };
