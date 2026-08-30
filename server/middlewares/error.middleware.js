const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
    errors = [message];
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}`;
    errors = [message];
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors || {}).map((e) => e.message);
    message = "Validation Error";
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errors = ["Invalid token"];
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
    errors = ["Token has expired"];
  }

  // Multer Errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large";
    } else {
      message = err.message || "File upload error";
    }
    errors = [message];
  }

  const response = {
    success: false,
    message,
    errors,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
