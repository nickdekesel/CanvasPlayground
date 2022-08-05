import { RefObject, useEffect, useRef } from "react";
import { getRelativePosition } from "../utils/getRelativePosition";

export type Position = { x: number; y: number };
export enum MouseButton {
  Left,
  Middle,
  Right,
}
export type DragEvent = {
  start: Position;
  end: Position;
  delta: Position;
  mouseButton?: MouseButton;
};
export type DragEventHandler = (event: DragEvent) => void;
export type DragOptions = {
  onDrag?: DragEventHandler;
  onDragStart?: DragEventHandler;
  onDragEnd?: DragEventHandler;
};

export const useDrag = (
  elementRef: RefObject<HTMLElement>,
  { onDrag, onDragStart, onDragEnd }: DragOptions
) => {
  const isDragging = useRef<boolean>(false);
  const startPosition = useRef<Position | null>(null);
  const currentPosition = useRef<Position | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element === null) {
      return;
    }

    const handleMouseDown = (event: MouseEvent) => {
      startPosition.current = getRelativePosition(
        element,
        event.clientX,
        event.clientY
      );
      currentPosition.current = startPosition.current;
      isDragging.current = true;
      onDragStart?.({
        start: startPosition.current,
        end: startPosition.current,
        delta: { x: 0, y: 0 },
        mouseButton: event.button,
      });
    };

    const handleMouseUp = (event: MouseEvent) => {
      isDragging.current = false;
      if (startPosition.current && currentPosition.current) {
        onDragEnd?.({
          start: startPosition.current,
          end: currentPosition.current,
          delta: {
            x: currentPosition.current.x - startPosition.current.x,
            y: currentPosition.current.x - startPosition.current.y,
          },
          mouseButton: event.button,
        });
      }
      startPosition.current = null;
      currentPosition.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (startPosition.current == null || currentPosition.current == null) {
        return;
      }

      const endPosition = getRelativePosition(
        element,
        event.clientX,
        event.clientY
      );
      const movedX = endPosition.x - currentPosition.current.x;
      const movedY = endPosition.y - currentPosition.current.y;
      const delta = { x: movedX, y: movedY };

      onDrag?.({
        start: startPosition.current,
        end: endPosition,
        delta,
      });
      currentPosition.current = endPosition;
    };

    element.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [elementRef, onDrag, onDragStart, onDragEnd]);

  return { isDragging };
};
