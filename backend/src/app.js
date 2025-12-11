import express from "express";
import indexRoutes from "./routes/index.routes.js";


export const app = express();

app.use(express.json());
app.use("/api", indexRoutes);




