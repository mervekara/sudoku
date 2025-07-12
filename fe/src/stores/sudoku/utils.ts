import type { Difficulty } from "@/src/types/type";

export const deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const getRandomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const visibleMap: Record<Difficulty, () => number> = {
  beginner: () => getRandomInRange(36, 40),
  intermediate: () => getRandomInRange(32, 35),
  hard: () => getRandomInRange(28, 31),
  expert: () => getRandomInRange(24, 27),
};
