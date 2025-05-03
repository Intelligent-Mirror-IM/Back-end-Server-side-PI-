import { request } from "express";
import JWT from "jsonwebtoken";
import User from "../models/userSchema.js";

const jwtVerify = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    JWT.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Unauthorized", error: err.message });
      }
      req.user = decoded;
      const temp = await User.findOne({ _id: decoded.id });
      if (!temp) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      console.log(temp);
      next();
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export { jwtVerify };
