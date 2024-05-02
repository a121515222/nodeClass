const handleProductionError = (err) => {
  //mongoose錯誤
  if (err.name === "ValidationError") {
    return err.message;
    //nodejs本身錯誤
  } else if (err.name === "ReferenceError") {
    return err.message;
  } else {
    return err;
  }
};
const handleDevError = (err, res) => {
  if (err.name === "ValidationError") {
    res.status(err.statusCode || 500).json({
      status: false,
      message: {
        errors: err.message,
        name: err.name,
        stack: err.stack,
      },
    });
  } else {
    res.status(err.statusCode || 500).json({
      status: false,
      message: err,
    });
  }
};
module.exports = { handleProductionError, handleDevError };
