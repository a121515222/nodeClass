const handleError = (err) => {
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

module.exports = handleError;
