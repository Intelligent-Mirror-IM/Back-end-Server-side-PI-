import express from "express";
import {
  aiLogResponse,
  checkActiveSession,
} from "../controllers/chatbotController.js";
import { JWT } from "google-auth-library";
import { jwtVerify } from "../utils/helpers.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Chatbot API is working" });
});
router.get("/active-session", jwtVerify, checkActiveSession);
router.post("/message", aiLogResponse);

export default router;
