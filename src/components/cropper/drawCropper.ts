import { Position } from "utils/positionUtils";

export const getDrawDimensions = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | ImageBitmap,
  zoom: number
) => {
  if (image == null || image.width === 0 || image.height === 0) {
    return { width: 0, height: 0 };
  }

  const canvasWidth = ctx.canvas.clientWidth;
  const canvasHeight = ctx.canvas.clientHeight;

  const aspectRatio = image.width / image.height;

  const drawWidth = aspectRatio > 1 ? canvasHeight * aspectRatio : canvasWidth;
  const drawHeight = aspectRatio < 1 ? canvasWidth / aspectRatio : canvasHeight;

  return { width: drawWidth * zoom, height: drawHeight * zoom } as const;
};

export const drawBackgroundColor = (
  ctx: CanvasRenderingContext2D,
  color: string
) => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | ImageBitmap,
  offset: Position,
  zoom: number
) => {
  const { width, height } = getDrawDimensions(ctx, image, zoom);
  ctx.drawImage(image, offset.x, offset.y, width, height);
};
