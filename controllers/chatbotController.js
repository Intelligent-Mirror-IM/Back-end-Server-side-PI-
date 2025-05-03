import AiLog from "../models/aiLogSchema.js";
import User from "../models/userSchema.js";
import { currentActiveUser } from "../utils/currentActiveUser.js";

const aiLogResponse = async (req, res) => {
  const { prompt, response, status, errorMessage } = req.body;

  if (!currentActiveUser.getCurrentUser()) {
    return res.status(401).json({ message: "No active User." });
  }
  const userId = currentActiveUser.getCurrentUser();
  if (!userId) {
    return res.status(401).json({ message: "No active User." });
  }

  if (!prompt || !response) {
    return res
      .status(400)
      .json({ message: "Both prompt and response fields are required." });
  }

  try {
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const aiLog = new AiLog({
      userId: user._id,
      prompt,
      response,
      status: status || "success",
      errorMessage,
    });

    await aiLog.save();
    user.aiLogs.push(aiLog._id);
    await user.save();

    return res.status(201).json(aiLog);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export { aiLogResponse };
