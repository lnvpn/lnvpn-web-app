"use server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Check if Mongoose is already connected
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database.");
      return mongoose;
    }

    console.log("Connecting to the database...");
    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });

    console.log("Database connection established successfully.");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database");
  }
}
