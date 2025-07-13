import { SUDOKU_COLORS } from "@/src/utils/canvas/canvasConfig";
import { drawDrafts } from "@/src/utils/canvas/drawDrafts";
import type { SudokuCell } from "@/src/types/type";

interface SelectedCell {
  row: number;
  col: number;
}

export function drawCell(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  cellSize: number,
  grid: SudokuCell[][],
  selected: SelectedCell | null,
): void {
  const cell = grid[row][col];
  const x = col * cellSize;
  const y = row * cellSize;

  let bgColor: string = SUDOKU_COLORS.defaultCell;

  if (selected) {
    const selectedCell = grid[selected.row][selected.col];
    const sameRow = selected.row === row;
    const sameCol = selected.col === col;
    const sameBox =
      Math.floor(selected.row / 3) === Math.floor(row / 3) &&
      Math.floor(selected.col / 3) === Math.floor(col / 3);
    const isSameValue =
      selectedCell.value !== null && selectedCell.value === cell.value;

    if (selected.row === row && selected.col === col) {
      bgColor = SUDOKU_COLORS.selectedCell;
    } else if (isSameValue && cell.value !== null) {
      bgColor = SUDOKU_COLORS.sameValueCell;
    } else if (sameRow || sameCol || sameBox) {
      bgColor = SUDOKU_COLORS.highlightCell;
    }
  }

  if (cell.isError) {
    bgColor = SUDOKU_COLORS.errorCell;
  } else if (cell.isHint) {
    bgColor = SUDOKU_COLORS.hintCell;
  }

  // Fill cell background
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, cellSize, cellSize);

  // Border
  ctx.strokeStyle = SUDOKU_COLORS.borderLight;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, cellSize, cellSize);

  // Highlight selected border
  if (selected?.row === row && selected?.col === col) {
    ctx.strokeStyle = SUDOKU_COLORS.selectedBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
  }

  // Draw value or drafts
  if (cell.value !== null) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = SUDOKU_COLORS.text;
    ctx.font = `${cell.isInitial ? "1000" : "400"} ${cellSize * 0.6}px Arial`;
    ctx.fillText(cell.value.toString(), x + cellSize / 2, y + cellSize / 2);
  } else {
    drawDrafts(ctx, cell.drafts, x, y, cellSize);
  }
}
