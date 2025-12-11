import { Router } from "express";
import { successResponse } from "../utils/index.util";
import config from "../config/env.config.js";
import logger from "../lib/logger.lib.js";
import mongoose from "mongoose";
import authRoutes from "./auth.route.js";
import { app } from "../app.js";

const router = Router();

router.route("/").get((req, res, next) => {
  try {
    successResponse(res, 200, "AI-Booksmith API is running successfully", {
      appName: "AI-Booksmith",
      status: process.uptime() > 0 ? "Running" : "Stopped",
      timestamp: new Date().toISOString(),
      version: config.APP_VERSION,
      env: config.NODE_ENV,
    });
  } catch (error) {
    logger.error("Error in root route", {
      label: "RootRoute",
      error,
    });
    next(error);
  }
});

router.route("/health").get((req, res, next) => {
  try {
    const dbState =
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

    successResponse(res, 200, "Health Check Successful", {
      status: "ok",
      service: "AI-Booksmith",
      environment: config.NODE_ENV,
      database: dbState,
      uptime: process.uptime(),
      memoryUsage: `${process.memoryUsage().heapUsed / 1024 / 1024} MB`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in health route", {
      label: "HealthRoute",
      error,
    });
    next(error);
  }
});

router.use("/api/v1/auth", authRoutes);

router.use((req, res, next) => {
  logger.warn(`Route not found: ${req.originalUrl}`, {
    label: "NotFoundRoute",
  });
  next(
    new APIError(404, "Not Found", {
      type: "NOT_FOUND",
      details: [
        {
          field: "route",
          message: `The route ${req.originalUrl} does not exist`,
        },
      ],
    })
  );
});

export default router;
