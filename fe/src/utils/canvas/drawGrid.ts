import { SUDOKU_COLORS, MAX_CANVAS_SIZE } from "./canvasConfig";
import { drawCell } from "./drawCell";

export function drawGrid(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  grid: any[][],
  selectedCell: { row: number; col: number } | null
) {
  const size = Math.min(MAX_CANVAS_SIZE, window.innerWidth - 40);
  const cellSize = size / 9;

  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  ctx.clearRect(0, 0, size, size);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      drawCell(ctx, row, col, cellSize, grid, selectedCell);
    }
  }

  ctx.strokeStyle = SUDOKU_COLORS.borderDark;
  ctx.lineWidth = 3;
  for (let i = 0; i <= 9; i++) {
    if (i % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }
  }
}
