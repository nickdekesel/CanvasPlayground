import { Rectangle, Shape } from "../models/Shape";
import { getOffsetPosition, getScaledData, Position } from "./positionUtils";

export type Selection = { start: Position; end: Position };

export const getSelectionContainer = (
  shapes: Shape[],
  selectedIds: string[],
  offset: Position,
  scale: number
): Rectangle | null => {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));

  const margin = 2;

  let minX, maxX, minY, maxY;
  for (let shape of selectedShapes) {
    const {
      width,
      height,
      offset: scaleOffset,
    } = getScaledData(shape.width, shape.height, scale);
    const { x, y } = getOffsetPosition(shape.position, [offset, scaleOffset]);

    minX = minX ? Math.min(minX, x) : x;
    minY = minY ? Math.min(minY, y) : y;
    maxX = maxX ? Math.max(maxX, x + width) : x + width;
    maxY = maxY ? Math.max(maxY, y + height) : y + height;
  }

  if (minX == null || maxX == null || minY == null || maxY == null) {
    return null;
  }

  return new Rectangle(
    "selection-area",
    {
      x: minX - margin,
      y: minY - margin,
    },
    maxX - minX + 2 * margin,
    maxY - minY + 2 * margin
  );
};
