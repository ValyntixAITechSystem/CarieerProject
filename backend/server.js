import { app } from "./app.js";
import { connectToDB } from "./config/db.config.js";
import { PORT } from "./config/env.config.js";

export const startServer = async () => {
  connectToDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Serving on http://localhost:${PORT}`);
    });
  });
};
