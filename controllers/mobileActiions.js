import AiLog from "../models/aiLogSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import { currentActiveUser } from "../utils/currentActiveUser.js";
dotenv.config();

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
  if (!currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "No active User." });
  }
  if (req.user.id != currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "Not The Same User" });
  }
  // TODO : Implement the logic to handle the prompt and redirect it to the AI model
};

export { retriveAiLogs, askMaia };
