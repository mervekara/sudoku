import express from "express";
import { body } from "express-validator";
import { getTopScores, saveScore } from "../controllers/leaderboardController";

const router = express.Router();

const validationRules = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters."),

  body("level")
    .isIn(["beginner", "intermediate", "hard", "expert"])
    .withMessage("Invalid level."),

  body("score").isNumeric().withMessage("Score must be a number."),
];

router.get("/leaderboard", getTopScores);
router.post("/leaderboard", validationRules, saveScore);

export default router;
