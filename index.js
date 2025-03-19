const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chatbotDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema
const messageSchema = new mongoose.Schema({
  message: String,
});

// Create a model
const Message = mongoose.model("Message", messageSchema);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/api/chatbot", (req, res) => {
  res.json({ message: "Hello, World" });
});


