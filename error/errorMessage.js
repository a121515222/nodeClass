const returnErrorMessage = (error, res) => {
  const errors = {};
  if (error.errors) {
    // 將錯誤訊息轉換成物件格式
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });
  }
  // 回傳錯誤status 400，並將錯誤訊息以 JSON 格式回傳
  res.status(400).json({ message: "something wrong", errors });
};

module.exports = returnErrorMessage;
