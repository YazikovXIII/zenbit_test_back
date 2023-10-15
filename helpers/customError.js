const CustomError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = CustomError;
