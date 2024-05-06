const handleProductionError = (err, res) => {
  let statusCode = err.statusCode || 500;
  let message = "Internal Server Error";

  switch (err.name) {
    case "ValidationError":
      message = Object.values(err.errors).map((val) => val.message);
      break;
    case "CastError":
      message =
        err.kind === "ObjectId" ? "找不到資料" : "資料庫忙碌中，請稍後再試";
      statusCode = err.kind === "ObjectId" ? 404 : statusCode;
      break;

    case "MongoServerError":
      if (err.code === 11000) {
        keyPattern = Object.keys(err.keyPattern);
        message = `已存在${keyPattern[0]}，請更換其他email註冊`;
        statusCode = 406;
      } else {
        message = "資料庫出錯，請稍後再試";
      }
      break;
    case "ReferenceError":
      message = "Server忙碌中，請稍後再試";
      break;
    case "Error":
      message = err.message;
      break;
    default:
      break;
  }

  res.status(statusCode).json({ status: false, message });
};

const handleDevError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = {
    errors: err.message,
    name: err.name,
    stack: err.stack,
  };

  res.status(statusCode).json({ status: false, message });
};

const customizeAppError = (httpStatus, errMessage) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  error.errorMessage = errMessage;
  return error;
};

module.exports = { handleProductionError, handleDevError, customizeAppError };
