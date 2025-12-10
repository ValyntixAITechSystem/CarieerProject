export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message || "Something went wrong";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
