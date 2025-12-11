import { app } from "./app.js";
import { connectToDatabase, gracefulShutdown } from "./config/db.config.js";
import config from "./config/env.config.js";
import logger from "./lib/logger.lib.js";

const PORT = config.PORT || 5000;

export const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      logger.info(`Server is running in the http://localhost:${PORT}`,{
        label: "Server",
      });
    });

    process.on("SIGINT", async () => gracefulShutdown(server));
    process.on("SIGTERM", async () => gracefulShutdown(server));
  } catch (error) {
    logger.error("Failed to start server", { label: "Server", error });
    process.exit(1);
  }
};
