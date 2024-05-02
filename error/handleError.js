const e = require("express");

const handleProductionError = (err, res) => {
  //mongoose錯誤
  console.log("err.name", err.name);
  if (err.name === "ValidationError") {
    //取出mongoose給錯誤訊息
    const message = Object.values(err.errors).map((val) => val.message);
    res.status(err.statusCode || 500).json({ status: false, message: message });
  } else if (err.name === "CastError") {
    if (err.kind === "ObjectId") {
      res.status(404).json({
        status: false,
        message: "找不到資料"
      });
    } else {
      res.status(err.statusCode || 500).json({
        status: false,
        message: "資料庫忙碌中，請稍後再試"
      });
    }
    //處理nodejs錯誤
  } else if (err.name === "ReferenceError") {
    res.status(err.statusCode || 500).json({
      status: false,
      message: "Server忙碌中，請稍後再試"
    });
    //處理自定義錯誤
  } else if (err.name === "Error") {
    res.status(err.statusCode || 500).json({
      status: false,
      message: err.message
    });
  }
};

const handleDevError = (err, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(err.statusCode || 500).json({
      status: false,
      message: {
        errors: err.message,
        name: err.name,
        stack: err.stack
      }
    });
  } else {
    res.status(err.statusCode || 500).json({
      status: false,
      message: err
    });
  }
};

const customizeAppError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  error.errorMessage = errMessage;
  return error;
};

module.exports = { handleProductionError, handleDevError, customizeAppError };
