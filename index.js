import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import mobileRoutes from "./routes/mobileRoute.js";
import passport from "passport";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { handleAiResponse } from "./controllers/mobileActiions.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);
export const connectedSockets = new Map();
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
  connectedSockets.set(socket.id, socket);
  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.emit("messageResponse", {
      received: true,
      message: "Server received your message",
    });
  });

  socket.on("aiResponse", (data) => {
    handleAiResponse(socket, data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    connectedSockets.delete(socket.id);
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

app.use("/api/maia", chatbotRoutes);
app.use("/api/mobile", mobileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
  for (const [socketId, socket] of connectedSockets.entries()) {
    socket.emit("messageResponse", "LOL");
  }
});
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
