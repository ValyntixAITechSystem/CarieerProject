import logger from "../lib/logger.lib.js";

export const successResponse = (res, statusCode, message, data = {}) => {
  logger.info(`Success Response: ${message}`, {
    label: "SuccessResponse",
    data: data,
  });

  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};
