import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

mongoose.createConnection(process.env.MONGO_URL).asPromise().then(() => {
  console.log("MongoDB connected");
}
).catch((err) => {
  console.log("MongoDB connection error:", err);
}
);
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error:", err);
}
);
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
}
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const PORT = process.env.PORT || 3000;

app.listen( PORT , () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/",(req,res) =>
{
	res.status(200).json({message:"It's working"});
});
app.get("/api/chatbot", (req, res) => {
  res.json({ message: "Hello, World" });
});


