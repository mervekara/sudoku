import { Schema, model, Document } from "mongoose";

export interface ILeaderboardEntry extends Document {
  name: string;
  level: "beginner" | "intermediate" | "hard" | "expert";
  score: number;
  createdAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    name: { type: String, required: true },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "hard", "expert"],
    },
    score: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<ILeaderboardEntry>("Leaderboard", LeaderboardSchema);
