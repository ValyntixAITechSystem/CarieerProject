import { app } from "./app.js";
import { connectToDB } from "./config/db.config.js";
import { PORT } from "./config/env.config.js";
import logger from "./lib/logger.lib.js";

export const startServer = async () => {

  logger.info("Connecting to the database...",{
    label: "DB",
  });
  connectToDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Serving on http://localhost:${PORT}`);
    });
  });
};
