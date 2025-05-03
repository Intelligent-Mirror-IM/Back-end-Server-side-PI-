import express from "express";
import { googleOauth, signup, login } from "../controllers/mobileController.js";
import passport from "passport";
import jwt from "jsonwebtoken";
import { jwtVerify } from "../utils/helpers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Mobile API is working" });
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-oauth", googleOauth);
router.get("/hey", jwtVerify, (req, res) => {
  res.status(200).json({ message: "Hey, you are authenticated!" });
});
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/mobile",
    session: false,
  }),
  (req, res) => {
    try {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      const userResponse = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt,
        token: token,
      };

      return res.status(200).json(userResponse);
    } catch (error) {
      console.error("Authentication callback error:", error);
      return res
        .status(500)
        .json({ message: "Authentication failed", error: error.message });
    }
  }
);

export default router;
