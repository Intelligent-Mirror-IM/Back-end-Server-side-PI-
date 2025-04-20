import express from "express";
import { signup } from "../controllers/mobileController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Mobile API is working" });
});

router.post("/signup", signup);

export default router;
