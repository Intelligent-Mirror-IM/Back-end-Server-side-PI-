import AiLog from "../models/aiLogSchema.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { activeUsers } from "../utils/currentActiveUser.js";
import { sendMail } from "../utils/mailHandler.js";
import OTP from "../utils/OTPhandler.js";
import { getGoogleProfileFromToken } from "../utils/firebaseAuth.js";
dotenv.config();

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    newUser.token = token;
    await newUser.save();
    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      token: token,
    };

    activeUsers.setCurrentUser("" + newUser._id, newUser);
    return res.status(201).json(userResponse);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    user.token = token;
    await user.save();

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token: user.token,
    };
    activeUsers.setCurrentUser("" + user._id, user);
    console.log(userResponse);
    return res.status(200).json(userResponse);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const logout = async (req, res) => {
  if (!activeUsers.isUserActive(req.user.id)) {
    return res.status(401).json({ message: "No active User." });
  }
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    user.token = null;
    await user.save();
    activeUsers.removeUser(userId);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No user found with this email" });
    OTP.generateOTP(email, 6);
    sendMail(
      email,
      "FORGOT PASSSWORD",
      `Your one time password is ${OTP.getOTP(email)}`
    );
    return res.status(200).json({
      message: "OTP email is sent successfully",
    });
  } catch (error) {
    console.error("Error in forgot password: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const checkOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }
  if (!OTP.verifyOTP(email, otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    user.token = token;
    await user.save();
    activeUsers.setCurrentUser("" + user._id, user);
    return res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Error in OTP verification: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found with this email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    OTP.deleteOTP(email);
    sendMail(
      email,
      "Password Reset Success!",
      "Your password has been reset successfully"
    );
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in reset password: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const googleOauth = async (req, res) => {
  const firebaseToken = req.body.firebaseToken;
  if (!firebaseToken) {
    return res.status(400).json({ message: "Firebase token is required" });
  }
  try {
    const googleProfile = await getGoogleProfileFromToken(firebaseToken);
    const { googleId, email, username } = googleProfile;
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.googleAccessToken = firebaseToken;
        await user.save();
      } else {
        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);

        user = new User({
          username,
          email,
          googleId,
          googleAccessToken: firebaseToken,
          password: hashedPassword,
        });
        await user.save();
      }
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    user.token = token;
    await user.save();
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      token: token,
    };
    activeUsers.setCurrentUser("" + user._id, user);
    console.log("User logged in successfully using Google OAuth");
    return res.status(200).json(userResponse);
  } catch (error) {
    console.error("Error in Google OAuth: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const editProfile = async (req, res) => {
  if (!activeUsers.isUserActive(req.user.id)) {
    return res.status(401).json({ message: "No active User." });
  }

  const { username, email } = req.body;
  if (!username && !email) {
    return res.status(400).json({ message: "No fields to update" });
  }
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    const userResponse = {
      email: user.email,
      username: user.username,
    };
    return res
      .status(200)
      .json({ message: "Profile updated successfully", userResponse });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const deleteAccount = async (req, res) => {
  if (!activeUsers.isUserActive(req.user.id)) {
    return res.status(401).json({ message: "No active User." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await AiLog.deleteMany({ userId: req.user.id });

    await User.deleteOne({ _id: req.user.id });

    activeUsers.removeUser(req.user.id);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error in delete account: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
export {
  signup,
  login,
  googleOauth,
  logout,
  editProfile,
  forgotPassword,
  checkOTP,
  resetPassword,
  deleteAccount,
};
