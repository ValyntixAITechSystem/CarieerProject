import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import indexRoutes from "./routes/index.routes.js";
import { ErrorHandler } from "./utils/ErrorHandler.util.js";

export const app = express();

app.use(express.json());
app.use("/api", indexRoutes);

app.use((req, res, next) => {
  next(new ErrorHandler(`Route not found - ${req.originalUrl}`, 404));
});

app.use(errorMiddleware);
