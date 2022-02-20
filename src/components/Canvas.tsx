import { FunctionComponent, useEffect } from "react";
import { useCanvas } from "../hooks/useCanvas";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import "./Canvas.scss";

type CanvasProps = {
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
};

export const Canvas: FunctionComponent<CanvasProps> = ({ draw }) => {
  const canvasRef = useCanvas(draw);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }

    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowHeight + "px";
  }, [canvasRef, windowWidth, windowHeight]);

  return <canvas ref={canvasRef} className="canvas" />;
};
