import { useEffect, useRef } from "react";
import { resizeCanvas } from "../utils/resizeCanvas";

export const useCanvas = (
  draw: (context: CanvasRenderingContext2D, frame: number) => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas == null || ctx == null) {
      return;
    }

    let frameCount = 0;
    let animationFrameId: number;
    ctx.translate(0.5, 0.5);

    const render = () => {
      ctx.save();
      resizeCanvas(canvas);
      const { width, height } = ctx.canvas;
      ctx.clearRect(0, 0, width, height);

      draw(ctx, frameCount);

      frameCount++;
      ctx.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};
