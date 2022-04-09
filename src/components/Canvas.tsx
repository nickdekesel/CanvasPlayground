import { forwardRef, MutableRefObject, useEffect, useRef } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import "./Canvas.scss";

type CanvasProps = {
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
};

export const Canvas = forwardRef<HTMLCanvasElement | null, CanvasProps>(
  ({ draw }, forwardedRef) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useCanvas(canvasRef, draw);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();

    useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas == null) {
        return;
      }

      canvas.style.width = windowWidth + "px";
      canvas.style.height = windowHeight + "px";
    }, [canvasRef, windowWidth, windowHeight]);

    return (
      <canvas
        ref={(node) => {
          canvasRef.current = node;
          (forwardedRef as MutableRefObject<HTMLCanvasElement | null>).current =
            node;
        }}
        className="canvas"
      />
    );
  }
);
