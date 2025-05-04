import { request } from "express";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URL || "mongodb://localhost:27017/mydatabase",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        useCreateIndex: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (error.name === "MongoServerSelectionError") {
      console.error(
        "Could not connect to any servers in your MongoDB Atlas cluster. Check your connection string."
      );
    }

    if (process.env.NODE_ENV === "production") {
      console.error("MongoDB connection failed. Exiting application...");
      process.exit(1);
    }

    return false;
  }
};

export default connectDB;
