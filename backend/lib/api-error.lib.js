class APIError extends Error {
  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    isOperational = true,
    error,
    stack
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.error = error;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default APIError;
