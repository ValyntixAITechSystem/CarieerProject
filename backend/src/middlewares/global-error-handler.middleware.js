import jwt from "jsonwebtoken";
import APIError from "../lib/api-error.lib.js";
import logger from "../lib/logger.lib.js";

const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = jwt;

const globalErrorHandler = (err, req, res, next) => {
  let customError;

  if (err instanceof TokenExpiredError) {
    logger.error("JWT Token Expired", {
      label: "GlobalErrorHandlerMiddleware",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Authentication failed. Token has expired. Please log in again.",
      true,
      {
        type: "TokenExpiredError",
        details: [
          {
            field: "token",
            message: "The provided token has expired.",
          },
        ],
      }
    );
  } else if (err instanceof NotBeforeError) {
    logger.error("JWT Not Before Error occurred", {
      label: "GlobalErrorHandlerMiddleware",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Authentication failed. Token not active. Please log in again.",
      true,
      {
        type: "NotBeforeError",
        details: [
          {
            field: "token",
            message: "The provided token is not yet active.",
          },
        ],
      }
    );
  } else if (err instanceof JsonWebTokenError) {
    logger.error("JWT Error occurred", {
      label: "GlobalErrorHandlerMiddleware",
      error: err.message,
    });
    customError = new APIError(
      401,
      "Authentication failed. Invalid token. Please log in again.",
      true,
      {
        type: "JsonWebTokenError",
        details: [
          {
            field: "token",
            message: "The provided token is invalid.",
          },
        ],
      }
    );
  } else if (err instanceof APIError) {
    logger.error("API Error occurred", {
      label: "GlobalErrorHandlerMiddleware",
      error: err.message,
    });
    customError = err;
  } else {
    const unknownError = err;
    logger.error("Unknown Error occurred", {
      label: "GlobalErrorHandlerMiddleware",
      error: unknownError.message,
    });
    customError = new APIError(
      500,
      unknownError.message || "Internal Server Error",
      false,
      {
        type: "InternalServerError",
        details: [
          {
            field: "unknown",
            message: "An unknown error occurred.",
          },
        ],
      },
      unknownError.stack
    );
  }

  res.status(customError.statusCode).json({
    success: customError.success,
    statusCode: customError.statusCode,
    message: customError.message,
    error: customError.error,
  });
};

export default globalErrorHandler;


// import config from "../config/env.config.js";
// import { ErrorHandler } from "../utils/ErrorHandler.util.js";

// const handleCastError = () => new ErrorHandler("Invalid ID format", 400);
// const handleValidationError = (error) => new ErrorHandler(error.message || "Validation failed", 400);
// const handleDuplicateKeyError = () => new ErrorHandler("Duplicate field value", 400);
// const handleJWTError = () => new ErrorHandler("Invalid Token", 401);
// const handleTokenExpiredError = () => new ErrorHandler("Token Expired. Please Login Again", 401);

// export const errorMiddleware = (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;
//   error.statusCode = error.statusCode || 500;

//   if (err.name === "CastError") error = handleCastError();
//   if (err.name === "ValidationError") error = handleValidationError(err);
//   if (err.code === 11000) error = handleDuplicateKeyError();
//   if (err.name === "JsonWebTokenError") error = handleJWTError();
//   if (err.name === "TokenExpiredError") error = handleTokenExpiredError();

//   if (config.NODE_ENV === "development") {
//     return res.status(error.statusCode).json({
//       success: false,
//       message: error.message
//     });
//   }

//   if (error.isOperational) {
//     return res.status(error.statusCode).json({
//       success: false,
//       message: error.message
//     });
//   }

//   return res.status(500).json({
//     success: false,
//     message: "Something went wrong"
//   });
// };