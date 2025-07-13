import { SUDOKU_COLORS } from "@/src/utils/canvas/canvasConfig";

/**
 * Draws draft (candidate) numbers in a Sudoku cell.
 * Supports up to 9 drafts (1-9) arranged in a 3x3 grid.
 */
export function drawDrafts(
  ctx: CanvasRenderingContext2D,
  drafts: number[],
  x: number,
  y: number,
  cellSize: number
): void {
  ctx.font = `${cellSize * 0.18}px Arial`;
  ctx.fillStyle = SUDOKU_COLORS.draftText;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drafts.forEach((digit: number, index: number): void => {
    const column = index % 3;
    const row = Math.floor(index / 3);

    const dx = x + (column + 0.5) * (cellSize / 3);
    const dy = y + (row + 0.5) * (cellSize / 3);

    ctx.fillText(digit.toString(), dx, dy);
  });
}
