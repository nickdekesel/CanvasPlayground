import { useEffect, useRef } from "react";

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
  element: HTMLElement | null,
  { onDrag, onDragStart, onDragEnd }: DragOptions
) => {
  const isDragging = useRef<boolean>(false);
  const startPosition = useRef<Position | null>(null);
  const currentPosition = useRef<Position | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      startPosition.current = { x: event.clientX, y: event.clientY };
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

      const endPosition = { x: event.clientX, y: event.clientY };
      const movedX = event.clientX - currentPosition.current.x;
      const movedY = event.clientY - currentPosition.current.y;
      const delta = { x: movedX, y: movedY };

      onDrag?.({
        start: startPosition.current,
        end: endPosition,
        delta,
      });
      currentPosition.current = { x: event.clientX, y: event.clientY };
    };

    element?.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      element?.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [element, onDrag, onDragStart, onDragEnd]);

  return { isDragging };
};
