import { get, post } from "@/src/services/api";

export interface LeaderboardEntry {
  _id: string;
  level: "beginner" | "intermediate" | "hard" | "expert";
  name: string;
  score: number;
}

export const getLeaderboard = async (): Promise<
  Record<LeaderboardEntry["level"], LeaderboardEntry[]>
> => {
  return get("/leaderboard");
};

export const addToLeaderboard = async (
  entry: Omit<LeaderboardEntry, "_id">
): Promise<{ success: boolean }> => {
  return post("/leaderboard", entry);
};
