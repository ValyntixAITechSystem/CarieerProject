import jwt from "jsonwebtoken";
import APIError from "./api-error.lib.js";
import logger from "./logger.lib.js";

function signToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  });
}

function verifyToken(token, secret) {
  try {
    logger.info("Token verified successfully", {
      label: "JWT",
    });
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error("Token verification failed", {
      label: "JWT",
      error: error.message,
    });
    throw new APIError(401, "Invalid or expired token", true, {
      type: "JWT Error",
      details: [
        {
          field: "token",
          message: error.message,
        },
      ],
    });
  }
}

const jwtLib = {
  generateAccessToken: (payload) => {
    return signToken(payload, process.env.ACCESS_TOKEN_SECRET, "15m");
  },
  generateRefreshToken: (payload) => {
    return signToken(payload, process.env.REFRESH_TOKEN_SECRET, "7d");
  },
  verifyAccessToken: (token) => {
    return verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
  },
  verifyRefreshToken: (token) => {
    return verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
  },
};

export default jwtLib;