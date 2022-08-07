import { RefObject, useEffect } from "react";
import { getRelativePosition, Position } from "../utils/positionUtils";

export const useHover = (
  elementRef: RefObject<HTMLElement>,
  onHover: (position: Position) => void
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (element == null) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      onHover(getRelativePosition(element, event.clientX, event.clientY));
    };

    element.addEventListener("mousemove", handleMouseMove);
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [elementRef, onHover]);
};
