import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  googleid: {
    type: String,
    default: null,
  },
  aiLogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiLog",
    },
  ],
});

const User = mongoose.model("User", userSchema);
export default User;
