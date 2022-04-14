import { useEffect } from "react";
import { Position } from "./useDrag";

export const useHover = (
  element: HTMLElement | null,
  onHover: (position: Position) => void
) => {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      onHover({ x: event.clientX, y: event.clientY });
    };

    element?.addEventListener("mousemove", handleMouseMove);
    return () => {
      element?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [element, onHover]);
};
