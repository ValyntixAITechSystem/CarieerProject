import { config } from "dotenv";

config();

export const { MONGO_URI, NODE_ENV,PORT } = process.env;
