const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/",(req,res) =>
{
	res.status(200).json({message:"It's working"});
});
app.get("/api/chatbot", (req, res) => {
  res.json({ message: "Hello, World" });
});


