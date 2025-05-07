import AiLog from "../models/aiLogSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import { currentActiveUser } from "../utils/currentActiveUser.js";
import { connectedSockets as sockets } from "../index.js";
dotenv.config();

const pendingRequests = new Map();

const retriveAiLogs = async (req, res) => {
  if (!currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "No active User." });
  }
  if (req.user.id != currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "Not The Same User" });
  }
  const userId = currentActiveUser.getCurrentUser();
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const aiLogs = await AiLog.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    return res.status(200).json(aiLogs);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const askMaia = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  if (!currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "No active User." });
  }
  if (req.user.id != currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "Not The Same User" });
  }
  try {
    const userId = req.user.id;
    const requestId = `req_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;
    console.log("Request ID:", requestId);
    const aiLog = new AiLog({
      userId,
      prompt,
      status: "processing",
    });
    await aiLog.save();
    if (sockets.size === 0) {
      aiLog.status = "error";
      aiLog.errorMessage = "No active socket connection";
      return res.status(503).json({ message: "No active socket connection" });
    }
    const responsePromise = new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        pendingRequests.delete(requestId);
        aiLog.status = "error";
        aiLog.errorMessage = "Request timed out";
        reject(new Error("Request timed out"));
      }, 30000);
      pendingRequests.set(requestId, {
        resolve: (response) => {
          clearTimeout(timeoutId);
          aiLog.status = "success";
          aiLog.response = response.response;
          resolve(response);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          aiLog.status = "error";
          aiLog.errorMessage = error.message;
          reject(error);
        },
      });
    });
    const socket = Array.from(sockets.values())[0];
    if (!socket || !socket.connected) {
      throw new Error("Socket connection is not available");
    }
    socket.emit("processAiRequest", {
      requestId,
      prompt,
      userId,
    });
    const aiResponse = await responsePromise;
    console.log(aiResponse);
    aiLog.response = aiResponse;
    aiLog.status = "success";
    const user = await User.findById(userId);
    await aiLog.save();
    user.aiLogs.push(aiLog._id);
    await user.save();

    console.log("Last Log", aiLog);
    return res
      .status(200)
      .json({ message: "Request sent to AI model", aiResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const handleAiResponse = async (socket, data) => {
  const { requestId, response, error } = data;
  console.log("Received AI response:", data);

  if (pendingRequests.has(requestId)) {
    const { resolve, reject } = pendingRequests.get(requestId);
    pendingRequests.delete(requestId);

    if (error) {
      reject(new Error(error));
    } else {
      resolve(response);
    }
  } else {
    console.error("Request ID not found:", requestId);
  }
};
export { retriveAiLogs, askMaia, handleAiResponse };
