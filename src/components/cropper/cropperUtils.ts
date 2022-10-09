import { Position } from "utils/positionUtils";
import { getDrawDimensions } from "./drawCropper";

const getOffsetForCenteredZoomFromDimensions = (
  currentOffset: Position,
  currentWidth: number,
  currentHeight: number,
  currentZoom: number,
  newZoom: number
) => {
  const widthAfter = currentWidth * (newZoom / currentZoom);
  const heightAfter = currentHeight * (newZoom / currentZoom);
  const newXOffset = currentOffset.x - (widthAfter - currentWidth) / 2;
  const newYOffset = currentOffset.y - (heightAfter - currentHeight) / 2;

  return { x: newXOffset, y: newYOffset } as const;
};

export const getOffsetForCenteredZoom = (
  canvasElement: HTMLCanvasElement | null,
  image: HTMLImageElement | ImageBitmap,
  currentOffset: Position,
  currentZoom: number,
  newZoom: number
) => {
  const ctx = canvasElement?.getContext("2d");
  if (ctx == null) {
    return currentOffset;
  }

  const { width: widthBefore, height: heightBefore } = getDrawDimensions(
    ctx,
    image,
    currentZoom / 100
  );

  return getOffsetForCenteredZoomFromDimensions(
    currentOffset,
    widthBefore,
    heightBefore,
    currentZoom,
    newZoom
  );
};
