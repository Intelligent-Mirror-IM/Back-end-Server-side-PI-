import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
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
    required: true,
  },
  status: {
    type: String,
    enum: ["success", "error"],
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
