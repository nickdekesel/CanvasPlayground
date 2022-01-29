import { FunctionComponent, useEffect, useRef } from "react";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import "./Canvas.scss";

interface CanvasProps {
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
}

export const Canvas: FunctionComponent<CanvasProps> = ({ draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas == null || ctx == null) {
      return;
    }
    const width = windowWidth;
    const height = windowHeight;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Normalize coordinate system to use css pixels.
    ctx.scale(scale, scale);
    ctx.translate(0.5, 0.5);

    let frame = 0;
    let animationFrameId: number;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      draw(ctx, frame);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, windowWidth, windowHeight]);

  return <canvas ref={canvasRef} className="canvas" />;
};
