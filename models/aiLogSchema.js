import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    default: "NO RESPONSE",
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "error", "processing"],
    default: "success",
  },
  errorMessage: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const AiLog = mongoose.model("AiLog", aiLogSchema);
export default AiLog;
