import { CSSProperties, forwardRef, useRef } from "react";
import { useCanvas } from "hooks/useCanvas";
import { useCombinedRefs } from "hooks/useCombinedRefs";
import "./Canvas.scss";

type CanvasProps = {
  style?: CSSProperties;
  draw: (context: CanvasRenderingContext2D, frame: number) => void;
};

export const Canvas = forwardRef<HTMLCanvasElement | null, CanvasProps>(
  ({ style, draw }, forwardedRef) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const refs = useCombinedRefs([canvasRef, forwardedRef]);
    useCanvas(canvasRef, draw);

    return <canvas ref={refs} className="canvas" style={style} />;
  }
);
