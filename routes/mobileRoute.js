import express from "express";
import {
  googleOauth,
  signup,
  login,
  logout,
  editProfile,
  forgotPassword,
  checkOTP,
  resetPassword,
  deleteAccount,
} from "../controllers/mobileController.js";
import jwt from "jsonwebtoken";
import { jwtVerify } from "../utils/helpers.js";
import {
  retriveAiLogs,
  askMaia,
  deleteLogs,
} from "../controllers/mobileActiions.js";
import { activeUsers } from "../utils/currentActiveUser.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Mobile API is working" });
});

const returnActiveUsers = (req, res) => {
  console.log(activeUsers.getAllActiveUsers());
  return res.status(200).json({ activeUsers: activeUsers.getAllActiveUsers() });
};

router.post("/signup", signup);
router.post("/login", login);
router.post("/firebase-auth", googleOauth);
router.post("/logout", jwtVerify, logout);
router.post("/ask-maia", jwtVerify, askMaia);
router.post("/forgot-password", forgotPassword);
router.post("/check-otp", checkOTP);
router.post("/reset-password", jwtVerify, resetPassword);
router.patch("/edit-profile", jwtVerify, editProfile);
router.delete("/delete-account", jwtVerify, deleteAccount);
router.delete("/delete-logs", jwtVerify, deleteLogs);
router.get("/get-active", returnActiveUsers);
router.get("/get-logs", jwtVerify, retriveAiLogs);

export default router;
