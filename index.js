import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import mobileRoutes from "./routes/mobileRoute.js";
import passport from "passport";
import cors from "cors";
import { google } from "googleapis";
import { Server } from "socket.io";
import http from "http";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

connectDB();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.emit("messageResponse", {
      received: true,
      message: "Server received your message",
    });
  });
  socket.volatile.emit("Response", "LOL");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());
// app.use(jwtVerify);

app.use("/api/maia", chatbotRoutes);
app.use("/api/mobile", mobileRoutes);
// app.use("/api/google", googleRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
