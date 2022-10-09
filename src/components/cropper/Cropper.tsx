import { FunctionComponent, useRef, useState } from "react";
import { Canvas } from "components/Canvas";
import { drawBackgroundColor, drawImage } from "./drawCropper";
import { Position } from "utils/positionUtils";
import { useDrag } from "hooks/useDrag";
import { ToolsInput } from "components/tools/ToolsInput";
import { getOffsetForCenteredZoom } from "./cropperUtils";
import { images } from "utils/images";

export const image = images["document"];

export const Cropper: FunctionComponent = () => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  const [croppedImage, setCroppedImage] = useState<string>();

  useDrag(canvasElement, {
    onDrag: (event) => {
      offset.current = {
        x: offset.current.x + event.delta.x,
        y: offset.current.y + event.delta.y,
      };
    },
  });

  const handleZoom = (newZoom: number) => {
    const currentZoom = zoom;
    setZoom(newZoom);
    offset.current = getOffsetForCenteredZoom(
      canvasElement.current,
      image,
      offset.current,
      currentZoom,
      newZoom
    );
  };

  const crop = () => {
    const croppedImage = canvasElement.current?.toDataURL();
    setCroppedImage(croppedImage);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawBackgroundColor(ctx, "#f4f4f4");
    drawImage(ctx, image, offset.current, zoom / 100);
  };

  return (
    <div style={{ margin: 20 }}>
      <div
        style={{
          width: 355,
          height: 200,
          border: "1px solid black",
        }}
      >
        <Canvas ref={canvasElement} draw={draw} />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ToolsInput
          value={zoom}
          type="range"
          min={50}
          max={200}
          step={1}
          onChange={(value) => handleZoom(parseInt(value))}
        />
        <button onClick={crop}>Crop</button>
      </div>
      {croppedImage && (
        <img
          src={croppedImage}
          alt="cropped"
          width={355}
          height={200}
          style={{ border: "1px solid black" }}
        />
      )}
    </div>
  );
};
