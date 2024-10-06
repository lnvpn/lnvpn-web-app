import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable");
}

// Check if Mongoose is already connected
export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to the database.");
      return mongoose;
    }

    console.log("Connecting to the database...");
    const connection = await mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`, {
      bufferCommands: false,
    });

    console.log("Database connection established successfully.");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Failed to connect to the database");
  }
}
