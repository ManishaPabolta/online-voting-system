import mongoose from "mongoose";

// ======================================================
// MONGODB CONNECTION
// ======================================================

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI is missing from environment variables.");
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log("====================================");
    console.log("MongoDB Connected Successfully");
    console.log(`Database : ${mongoose.connection.name}`);
    console.log("====================================");
  } catch (error) {
    console.error("====================================");
    console.error("MongoDB Connection Error");
    console.error("====================================");
    console.error(error.message);

    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB runtime error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

export default connectDB;