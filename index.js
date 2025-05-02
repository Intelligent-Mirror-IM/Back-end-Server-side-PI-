import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import mobileRoutes from "./routes/mobileRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

connectDB();

app.use(express.json());

app.use("/api/maia", chatbotRoutes);
app.use("/api/mobile", mobileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
