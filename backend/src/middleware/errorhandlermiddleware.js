const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = 500;
  if (!message) message = "Internal Server Error";

  res.status(statusCode).json({
    error: true,
    response: {
      status: statusCode,
      message,
    },
  });
};

export default errorHandler;
