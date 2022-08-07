export type Position = { x: number; y: number };

export const getRelativePosition = (
  element: HTMLElement,
  x: number,
  y: number
) => {
  const { left, top } = element.getBoundingClientRect();
  return { x: x - left, y: y - top };
};

export const getOffsetPosition = (position: Position, offset: Position) => ({
  x: offset.x + position.x,
  y: offset.y + position.y,
});

export const getInverseOffsetPosition = (
  position: Position,
  offset: Position
) => ({
  x: position.x - offset.x,
  y: position.y - offset.y,
});
