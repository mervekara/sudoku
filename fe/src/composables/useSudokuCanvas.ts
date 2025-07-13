import { ref, onMounted, watch, nextTick } from "vue";
import type { Ref } from "vue";
import { debounce } from "lodash-es";
import { drawGrid } from "@/src/utils/canvas/drawGrid";

export function useSudokuCanvas(
  canvasRef: Ref<HTMLCanvasElement | null>,
  grid: Ref<any[][]>,
  selectedCell: Ref<{ row: number; col: number } | null>,
  onCellSelect: (row: number, col: number) => void,
  isFocused: Ref<boolean>,
) {
  const context = ref<CanvasRenderingContext2D | null>(null);

  const redraw = debounce(() => {
    if (canvasRef.value && context.value) {
      drawGrid(canvasRef.value, context.value, grid.value, selectedCell.value);
    }
  }, 10);

  const handleCanvasClick = (e: MouseEvent) => {
    if (!canvasRef.value) return;
    const rect = canvasRef.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = canvasRef.value.width / 9;
    const row = Math.floor(y / size);
    const col = Math.floor(x / size);
    onCellSelect(row, col);
    redraw();
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    handleCanvasClick({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };

  onMounted(() => {
    nextTick(() => {
      if (canvasRef.value) {
        context.value = canvasRef.value.getContext("2d");
        canvasRef.value.focus();
        redraw();
      }
    });
  });
  watch([grid, selectedCell, isFocused], redraw, { deep: true });

  return {
    context,
    redraw,
    handleCanvasClick,
    handleTouchStart,
  };
}
