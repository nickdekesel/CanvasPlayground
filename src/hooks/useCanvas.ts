import { RefObject, useEffect } from "react";
import { resizeCanvas } from "../utils/resizeCanvas";

export const useCanvas = (
  ref: RefObject<HTMLCanvasElement>,
  draw: (context: CanvasRenderingContext2D, frame: number) => void
) => {
  useEffect(() => {
    const canvas = ref.current;
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
  }, [ref, draw]);
};
