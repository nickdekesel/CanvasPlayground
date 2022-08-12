import { Shape } from "models/Shape";

export type Position = { x: number; y: number };

export const getRelativePosition = (
  element: HTMLElement,
  x: number,
  y: number
) => {
  const { left, top } = element.getBoundingClientRect();
  return { x: x - left, y: y - top };
};

export const getOffsetPosition = (position: Position, offsets: Position[]) => ({
  x: offsets.reduce((a, b) => a + b.x, 0) + position.x,
  y: offsets.reduce((a, b) => a + b.y, 0) + position.y,
});

export const getInverseOffsetPosition = (
  position: Position,
  offset: Position
) => ({
  x: position.x - offset.x,
  y: position.y - offset.y,
});

export const getScaledData = (width: number, height: number, scale: number) => {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaleOffsetX = (width - scaledWidth) / 2;
  const scaleOffsetY = (height - scaledHeight) / 2;
  return {
    width: scaledWidth,
    height: scaledHeight,
    offset: { x: scaleOffsetX, y: scaleOffsetY },
  };
};

export const getScaledShapeData = (shape: Shape, scale: number) => {
  const { width, height, offset } = getScaledData(
    shape.width,
    shape.height,
    scale
  );
  return {
    width,
    height,
    position: {
      x: shape.position.x + offset.x,
      y: shape.position.y + offset.y,
    },
  };
};
