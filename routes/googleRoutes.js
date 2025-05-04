import express from "express";
import { google } from "googleapis";
import { calenderAPI } from "../controllers/googleController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Google API is working" });
});

router.get("/calender");
