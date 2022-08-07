import { Rectangle, Shape } from "../models/Shape";
import { getOffsetPosition, Position } from "./positionUtils";

export type Selection = { start: Position; end: Position };

export const getSelectionContainer = (
  shapes: Shape[],
  selectedIds: string[],
  offset: Position
): Rectangle | null => {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));

  const margin = 2;

  let minX, maxX, minY, maxY;
  for (let shape of selectedShapes) {
    const { x, y } = getOffsetPosition(shape.position, offset);

    minX = minX ? Math.min(minX, x) : x;
    minY = minY ? Math.min(minY, y) : y;
    maxX = maxX ? Math.max(maxX, x + shape.width) : x + shape.width;
    maxY = maxY ? Math.max(maxY, y + shape.height) : y + shape.height;
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
