import {
  SUDOKU_COLORS,
  MAX_CANVAS_SIZE,
} from "@/src/utils/canvas/canvasConfig";
import { drawCell } from "@/src/utils/canvas/drawCell";
import type { SudokuCell } from "@/src/types/type";

interface SelectedCell {
  row: number;
  col: number;
}

/**
 * Draws the entire Sudoku grid onto the given canvas context.
 */
export function drawGrid(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  grid: SudokuCell[][],
  selectedCell: SelectedCell | null
): void {
  const size: number = Math.min(MAX_CANVAS_SIZE, window.innerWidth - 40);
  const cellSize: number = size / 9;

  canvas.width = size;
  canvas.height = size;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  ctx.clearRect(0, 0, size, size);

  // Draw all cells
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      drawCell(ctx, row, col, cellSize, grid, selectedCell);
    }
  }

  // Draw thick box borders
  ctx.strokeStyle = SUDOKU_COLORS.borderDark;
  ctx.lineWidth = 3;

  for (let i = 0; i <= 9; i++) {
    if (i % 3 === 0) {
      // Vertical bold line
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, size);
      ctx.stroke();

      // Horizontal bold line
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(size, i * cellSize);
      ctx.stroke();
    }
  }
}
