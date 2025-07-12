import { SUDOKU_COLORS } from "./canvasConfig";

export function drawDrafts(
  ctx: CanvasRenderingContext2D,
  drafts: number[],
  x: number,
  y: number,
  cellSize: number
) {
  ctx.font = `${cellSize * 0.18}px Arial`;
  ctx.fillStyle = SUDOKU_COLORS.draftText;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  drafts.forEach((d, index) => {
    const dx = x + ((index % 3) + 0.5) * (cellSize / 3);
    const dy = y + (Math.floor(index / 3) + 0.5) * (cellSize / 3);
    ctx.fillText(d.toString(), dx, dy);
  });
}
