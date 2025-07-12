import Leaderboard, { ILeaderboardEntry } from "../models/Leaderboard";

class LeaderboardRepository {
  async save(
    entry: Omit<ILeaderboardEntry, "_id" | "createdAt">
  ): Promise<ILeaderboardEntry> {
    return await new Leaderboard(entry).save();
  }

  async getTopScoresPerLevel(
    limit = 3
  ): Promise<Record<string, ILeaderboardEntry[]>> {
    const levels = ["beginner", "intermediate", "hard", "expert"];
    const result: Record<string, ILeaderboardEntry[]> = {};

    await Promise.all(
      levels.map(async (level) => {
        result[level] = await Leaderboard.find({ level })
          .sort({ score: -1 })
          .limit(limit);
      })
    );

    return result;
  }
}

export default new LeaderboardRepository();
