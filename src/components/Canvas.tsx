import { forwardRef, useEffect, useRef } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { useCombinedRefs } from "../hooks/useCombinedRefs";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import "./Canvas.scss";

type CanvasProps = {
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
};

export const Canvas = forwardRef<HTMLCanvasElement | null, CanvasProps>(
  ({ draw }, forwardedRef) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const refs = useCombinedRefs([canvasRef, forwardedRef]);
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

    return <canvas ref={refs} className="canvas" />;
  }
);
