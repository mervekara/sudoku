import express from "express";
import mongoose from "mongoose";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sudoku";

app.use(cors());
app.use(express.json());
app.use("/api", leaderboardRoutes);

mongoose
  .connect(MONGO_URI, { dbName: "sudoku", authSource: "admin" })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
