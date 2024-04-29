const handleErrorAsync = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

module.exports = handleErrorAsync;
