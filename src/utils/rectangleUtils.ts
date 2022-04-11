import { Rectangle } from "../components/Shape";

export const areRectanglesOverlapping = (a: Rectangle, b: Rectangle) => {
  const [aLeft, aTop, aRight, aBottom] = getSidesPositions(a);
  const [bLeft, bTop, bRight, bBottom] = getSidesPositions(b);

  // if next to each other
  if (aRight < bLeft || aLeft > bRight) {
    return false;
  }

  // if below/on top of each other
  if (aTop > bBottom || aBottom < bTop) {
    return false;
  }

  return true;
};

const getSidesPositions = (rectangle: Rectangle) => {
  const left = rectangle.position.x;
  const right = left + rectangle.width;
  const top = rectangle.position.y;
  const bottom = top + rectangle.height;

  return [left, top, right, bottom] as const;
};
