import mongoose from "mongoose";
import APIError from "../lib/api-error.lib.js";
import logger from "../lib/logger.lib.js";
import config from "./env.config.js";

const connectOptions = {
  dbName: config.DB_NAME,
  appName: config.APP_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  minPoolSize: 1,
  maxPoolSize: 100,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

let isConnected = false;

export const connectToDatabase = async () => {
  if (!config.MONGO_URI) {
    logger.error("MONGO_URI is not defined in environment variables", {
      label: "DatabaseConfig",
    });
    throw new APIError(500, "Database connection failed", true, {
      type: "InternalServerError",
      details: [
        {
          field: "MONGO_URI",
          message:
            "MONGO_URI is required but not defined in environment variables",
        },
      ],
    });
  }

  if (isConnected) return;

  try {
    await mongoose.connect(config.MONGO_URI, connectOptions);
    isConnected = true;
    logger.info("Connected to MongoDB database successfully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Failed to connect to MongoDB database", {
      label: "DatabaseConfig",
      error,
    });
    throw new APIError(500, "Database connection failed", true, error);
  }
};

export const disconnectFromDatabase = async () => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("Disconnected from MongoDB database successfully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Failed to disconnect from MongoDB database", {
      label: "DatabaseConfig",
      error,
    });
    throw new APIError(500, "Database disconnection failed", true, error);
  }
};

export const gracefulShutdown = async (server) => {
  logger.info("Received shutdown signal, closing server...", {
    label: "DatabaseConfig",
  });
  try {
    await disconnectFromDatabase();

    logger.info("Server closed successfully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Error during server shutdown", {
      label: "DatabaseConfig",
      error,
    });
  } finally {
    server.close(() => {
      logger.info("Server closed successfully", { label: "DatabaseConfig" });
      process.exit(0);
    });
  }
};
