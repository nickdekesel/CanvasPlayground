import { useEffect, useRef } from "react"

export type Position = { x: number; y: number };
export type DragEvent = { start: Position; end: Position; delta: Position };
export type DragEventHandler = (event: DragEvent) => void;
export type DragOptions = { onDrag?: DragEventHandler, onDragStart?: DragEventHandler, onDragEnd?: DragEventHandler}

export const useDrag = ({onDrag, onDragStart, onDragEnd}: DragOptions) => {
  const startPosition = useRef<Position | null>(null);
  const currentPosition = useRef<Position | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      startPosition.current = { x: event.clientX, y: event.clientY };
      currentPosition.current = startPosition.current;
      onDragStart?.({ start: startPosition.current, end: startPosition.current, delta: { x: 0, y: 0 } });
      window.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseUp = (_event: MouseEvent) => {
      if (startPosition.current && currentPosition.current) {
        onDragEnd?.({
          start: startPosition.current,
          end: currentPosition.current,
          delta: {
            x: currentPosition.current.x - startPosition.current.x,
            y: currentPosition.current.x - startPosition.current.y
          }
        });
      }
      startPosition.current = null;
      currentPosition.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (startPosition.current == null || currentPosition.current == null) {
        return;
      }

      const endPosition = { x: event.clientX, y: event.clientY };
      const movedX = event.clientX - currentPosition.current.x;
      const movedY = event.clientY - currentPosition.current.y;
      const delta = { x: movedX, y: movedY };

      onDrag?.({ start: startPosition.current, end: endPosition, delta });
      currentPosition.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [onDrag, onDragStart, onDragEnd]);
}