import { Circle, Line, Rectangle, Shape } from "../../models/Shape";
import {
  getOffsetPosition,
  getScaledData,
  Position,
} from "../../utils/positionUtils";
import { getSelectionContainer, Selection } from "../../utils/selectionUtils";

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  offset: Position,
  zoom: number
) => {
  const gap = 40 * zoom;
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;

  ctx.beginPath();
  ctx.strokeStyle = "#f4f4f4";
  ctx.lineWidth = 1;

  // draw vertical grid lines
  const startX = offset.x % gap;
  for (let x = startX; x < width; x += gap) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  // draw horizontal grid lines
  const startY = offset.y % gap;
  for (let y = startY; y < height; y += gap) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
};

const drawShapes = (
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  newShape: Shape | null,
  selectedShapesIds: string[],
  shapeIdsToSelect: string[],
  offset: Position,
  scale: number
) => {
  const allShapes: Shape[] = [...shapes];
  if (newShape) {
    allShapes.push(newShape);
  }

  for (let shape of allShapes) {
    ctx.beginPath();

    const {
      width,
      height,
      offset: scaleOffset,
    } = getScaledData(shape.width, shape.height, scale);
    const offsetPoint = getOffsetPosition(shape.position, [
      offset,
      scaleOffset,
    ]);

    const colors = shape.colors;
    if (colors.length > 0) {
      if (shape instanceof Rectangle) {
        ctx.fillStyle = colors[0];
        ctx.fillRect(offsetPoint.x, offsetPoint.y, width, height);
      } else if (shape instanceof Line) {
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 1;
        ctx.setLineDash([]);
        ctx.moveTo(offsetPoint.x, offsetPoint.y);
        ctx.lineTo(offsetPoint.x + width, offsetPoint.y + height);
        ctx.stroke();
      } else if (shape instanceof Circle) {
        ctx.fillStyle = colors[0];
        const x = offsetPoint.x + width / 2;
        const y = offsetPoint.y + height / 2;
        const radius = shape.getRadius(scale);
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        const borderColor = colors.length >= 2 ? colors[1] : null;
        if (borderColor) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 2 * scale;
          ctx.setLineDash([]);
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }

    if (shape.image != null) {
      const imagePadding = 10 * scale;
      ctx.drawImage(
        shape.image,
        offsetPoint.x + imagePadding,
        offsetPoint.y + imagePadding,
        width - 2 * imagePadding,
        height - 2 * imagePadding
      );
    }

    if (
      selectedShapesIds.includes(shape.id) ||
      shapeIdsToSelect.includes(shape.id)
    ) {
      drawShapeSelection(ctx, shape, offset, scale);
    }
  }
};

const drawSelectionArea = (
  ctx: CanvasRenderingContext2D,
  selection: Selection | null
) => {
  if (selection == null) {
    return;
  }

  const { start, end } = selection;
  const width = end.x - start.x;
  const height = end.y - start.y;

  ctx.beginPath();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = "#3399ff";
  ctx.fillRect(start.x, start.y, width, height);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#0000ff";
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.strokeRect(start.x, start.y, width, height);
};

const drawSelectionContainer = (
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  selectedShapesIds: string[],
  offset: Position,
  isDragging: boolean,
  shapeScale: number
) => {
  if (isDragging || selectedShapesIds.length <= 1) {
    return;
  }

  const container = getSelectionContainer(
    shapes,
    selectedShapesIds,
    offset,
    shapeScale
  );

  if (container == null) {
    return;
  }

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(
    container.position.x,
    container.position.y,
    container.width,
    container.height
  );
};

const drawShapeSelection = (
  ctx: CanvasRenderingContext2D,
  shape: Shape,
  offset: Position,
  scale: number
) => {
  const margin = 2;
  const {
    width,
    height,
    offset: scaleOffset,
  } = getScaledData(shape.width, shape.height, scale);
  const { x, y } = getOffsetPosition(shape.position, [offset, scaleOffset]);

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.setLineDash([10, 5]);
  ctx.strokeStyle = "#000";
  ctx.strokeRect(
    x - margin,
    y - margin,
    width + 2 * margin,
    height + 2 * margin
  );
};

const drawSelection = (
  ctx: CanvasRenderingContext2D,
  selection: Selection | null,
  shapes: Shape[],
  selectedShapesIds: string[],
  offset: Position,
  isDragging: boolean,
  shapeScale: number
) => {
  drawSelectionArea(ctx, selection);
  drawSelectionContainer(
    ctx,
    shapes,
    selectedShapesIds,
    offset,
    isDragging,
    shapeScale
  );
};

export const draw = (
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  newShape: Shape | null,
  selectedShapesIds: string[],
  shapesIdsToSelect: string[],
  selection: Selection | null,
  offset: Position,
  isDragging: boolean,
  zoom: number,
  shapeScale = 1
) => {
  drawGrid(ctx, offset, zoom);
  drawShapes(
    ctx,
    shapes,
    newShape,
    selectedShapesIds,
    shapesIdsToSelect,
    offset,
    shapeScale
  );
  drawSelection(
    ctx,
    selection,
    shapes,
    selectedShapesIds,
    offset,
    isDragging,
    shapeScale
  );
};
