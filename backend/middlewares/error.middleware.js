import { NODE_ENV } from "../config/env.config.js";
import { ErrorHandler } from "../utils/ErrorHandler.util.js";

const handleCastError = () => new ErrorHandler("Invalid ID format", 400);
const handleValidationError = (error) => new ErrorHandler(error.message || "Validation failed", 400);
const handleDuplicateKeyError = () => new ErrorHandler("Duplicate field value", 400);
const handleJWTError = () => new ErrorHandler("Invalid Token", 401);
const handleTokenExpiredError = () => new ErrorHandler("Token Expired. Please Login Again", 401);

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = error.statusCode || 500;

  if (err.name === "CastError") error = handleCastError();
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError();
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

  if (NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong"
  });
};
