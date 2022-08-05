export const getRelativePosition = (
  element: HTMLElement,
  x: number,
  y: number
) => {
  const { left, top } = element.getBoundingClientRect();
  return { x: x - left, y: y - top };
};
