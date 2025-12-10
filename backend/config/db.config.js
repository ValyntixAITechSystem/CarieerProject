import mongoose from "mongoose";
import { MONGO_URI } from "./env.config.js";

export const connectToDB = async () => {
  try {
    await mongoose
      .connect(MONGO_URI, {
        dbName: "Career_Project",
      })
      .then((c) => {
        console.log(`Connected to ${c.connection.host}`);
      });
  } catch (error) {
    console.log(`Couldn't Connect To DB`);
  }
};
