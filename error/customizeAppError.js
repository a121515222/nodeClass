const customizeAppError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  return error;
};

module.exports = customizeAppError;
