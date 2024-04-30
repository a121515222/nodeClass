const customizeAppError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  error.errorMessage = errMessage;
  return error;
};

module.exports = customizeAppError;
