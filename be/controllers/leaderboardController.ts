import { Request, Response } from "express";
import { validationResult } from "express-validator";
import LeaderboardRepository from "../repositories/LeaderboardRepository";

export const saveScore = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    await LeaderboardRepository.save(req.body);
    res.status(201).json({ message: "Score saved successfully" });
  } catch (err) {
    console.error("Saving score failed:", err);
    res.status(500).json({ error: "Error saving score" });
  }
};

export const getTopScores = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await LeaderboardRepository.getTopScoresPerLevel();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching top scores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
