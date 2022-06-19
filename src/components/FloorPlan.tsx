import { FunctionComponent, useRef, useState } from "react";
import { useDrag, Position } from "../hooks/useDrag";
import { Canvas } from "./Canvas";
import { Mode, ModesMenu } from "./menus/ModesMenu";
import { Line, Rectangle, Shape } from "./Shape";
import { useElementState } from "../hooks/useElementState";
import { areRectanglesOverlapping } from "../utils/rectangleUtils";
import "./FloorPlan.scss";
import { useHover } from "../hooks/useHover";

type Selection = { start: Position; end: Position };

const mockShapes: Shape[] = [
  new Rectangle("0", { x: 200, y: 400 }, 200, 200, "#FF0000"),
  new Rectangle("1", { x: 500, y: 600 }, 300, 200, "#00FF00"),
  new Line("2", { x: 100, y: 200 }, 100, 100, "#FF0000"),
];

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const [canvasElement, canvasRef] =
    useElementState<HTMLCanvasElement | null>();

  const selection = useRef<Selection | null>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const shapes = useRef<Shape[]>(mockShapes);
  const selectedShapesIds = useRef<string[]>([]);
  const shapeIdsToSelect = useRef<string[]>([]);

  const newShape = useRef<Shape | null>(null);

  const getOffsetPosition = (position: Position) => ({
    x: offset.current.x + position.x,
    y: offset.current.y + position.y,
  });

  const getInverseOffsetPosition = (position: Position) => ({
    x: position.x - offset.current.x,
    y: position.y - offset.current.y,
  });

  const getSelectionContainer = (): Rectangle | null => {
    const selectedShapes = shapes.current.filter((s) =>
      selectedShapesIds.current.includes(s.id)
    );

    const margin = 2;

    let minX, maxX, minY, maxY;
    for (let shape of selectedShapes) {
      const { x, y } = getOffsetPosition(shape.position);

      if (minX == null || x < minX) {
        minX = x;
      }
      if (minY == null || y < minY) {
        minY = y;
      }
      if (maxX == null || x + shape.width > maxX) {
        maxX = x + shape.width;
      }
      if (maxY == null || y + shape.height > maxY) {
        maxY = y + shape.height;
      }
    }

    if (minX == null || maxX == null || minY == null || maxY == null) {
      return null;
    }

    return new Rectangle(
      "selection-area",
      {
        x: minX - margin,
        y: minY - margin,
      },
      maxX - minX + 2 * margin,
      maxY - minY + 2 * margin
    );
  };

  const findHoverOverShape = (position: Position): Shape | null => {
    for (let i = shapes.current.length - 1; i >= 0; i--) {
      const shape = shapes.current[i];
      if (shape.isInside(position)) {
        return shape;
      }
    }
    return null;
  };

  const isHoveringOverSelection = (position: Position): boolean => {
    const selectionContainer = getSelectionContainer();
    return !!selectionContainer?.isInside(position);
  };

  const getShapesInSelectionArea = () => {
    if (selection.current == null) {
      return [];
    }

    const { start, end } = selection.current;
    const selectionArea = new Rectangle(
      "selection",
      getInverseOffsetPosition(start),
      end.x - start.x,
      end.y - start.y
    );
    selectionArea.fixAbsoluteDimensions();

    const shapesInSelectionArea = [];
    for (let shape of shapes.current) {
      if (areRectanglesOverlapping(selectionArea, shape)) {
        shapesInSelectionArea.push(shape.id);
      }
    }
    return shapesInSelectionArea;
  };

  const { isDragging } = useDrag(canvasElement, {
    onDragStart: ({ start, mouseButton }) => {
      console.log("start: ", mouseButton);
      isDragging.current = true;
      setCursor(start);
      if (mode === Mode.Selection) {
        const hoveringOverSelection = isHoveringOverSelection(start);

        if (hoveringOverSelection) {
          return;
        }

        const hoverOverShape = findHoverOverShape(
          getInverseOffsetPosition(start)
        );
        if (hoverOverShape) {
          if (!selectedShapesIds.current.includes(hoverOverShape.id)) {
            selectedShapesIds.current = [hoverOverShape.id];
          }
        } else {
          selectedShapesIds.current = [];
        }
      }
    },
    onDrag: ({ start, end, delta, mouseButton }) => {
      console.log("drag: ", mouseButton);
      if (mode === Mode.Move) {
        offset.current = {
          x: offset.current.x + delta.x,
          y: offset.current.y + delta.y,
        };
      } else if (mode === Mode.Selection) {
        if (selectedShapesIds.current.length) {
          const newShapes = [...shapes.current];
          for (let shape of newShapes) {
            if (!selectedShapesIds.current.includes(shape.id)) {
              continue;
            }

            shape.position.x += delta.x;
            shape.position.y += delta.y;
          }
          shapes.current = newShapes;
        } else {
          selection.current = { start, end };
          shapeIdsToSelect.current = getShapesInSelectionArea();
        }
      } else if (mode === Mode.Line) {
        newShape.current = new Line(
          String(shapes.current.length + 1),
          getInverseOffsetPosition(start),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      } else if (mode === Mode.Rectangle) {
        newShape.current = new Rectangle(
          String(shapes.current.length + 1),
          getInverseOffsetPosition(start),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      }
    },
    onDragEnd: ({ end, mouseButton }) => {
      console.log("end: ", mouseButton);
      isDragging.current = false;
      setCursor(end);
      if (newShape.current) {
        newShape.current.fixAbsoluteDimensions();
        shapes.current = [...shapes.current, newShape.current];
        selectedShapesIds.current = [newShape.current.id];
        newShape.current = null;
        setMode(Mode.Selection);
      } else if (mode === Mode.Selection && selection.current != null) {
        selectedShapesIds.current = [...shapeIdsToSelect.current];
        shapeIdsToSelect.current = [];
      }
      selection.current = null;
    },
  });

  const setDefaultCursor = () => {
    if (!canvasElement) {
      return;
    }

    if (mode === Mode.Move) {
      if (isDragging.current) {
        canvasElement.style.cursor = "grabbing";
      } else {
        canvasElement.style.cursor = "grab";
      }
    } else {
      canvasElement.style.cursor = "default";
    }
  };

  const setCursor = (position: Position) => {
    if (!canvasElement) {
      return;
    }

    if (mode === Mode.Selection && isHoveringOverSelection(position)) {
      canvasElement.style.cursor = "move";
    } else {
      setDefaultCursor();
    }
  };

  useHover(canvasElement, setCursor);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    const gap = 40;
    const width = ctx.canvas.clientWidth;
    const height = ctx.canvas.clientHeight;

    ctx.beginPath();
    ctx.strokeStyle = "#f4f4f4";
    ctx.lineWidth = 1;

    // draw vertical grid lines
    const startX = offset.current.x % gap;
    for (let x = startX; x < width; x += gap) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // draw horizontal grid lines
    const startY = offset.current.y % gap;
    for (let y = startY; y < height; y += gap) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  };

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    const allShapes: Shape[] = [...shapes.current];
    if (newShape.current) {
      allShapes.push(newShape.current);
    }

    for (let shape of allShapes) {
      ctx.beginPath();
      const offsetPoint = getOffsetPosition(shape.position);

      const color = shape.fill;

      if (shape instanceof Rectangle) {
        ctx.fillStyle = color;
        ctx.fillRect(offsetPoint.x, offsetPoint.y, shape.width, shape.height);
      } else if (shape instanceof Line) {
        ctx.strokeStyle = color;
        ctx.setLineDash([]);
        ctx.moveTo(offsetPoint.x, offsetPoint.y);
        ctx.lineTo(offsetPoint.x + shape.width, offsetPoint.y + shape.height);
        ctx.stroke();
      }

      if (
        selectedShapesIds.current.includes(shape.id) ||
        shapeIdsToSelect.current.includes(shape.id)
      ) {
        drawShapeSelection(shape, ctx);
      }
    }
  };

  const drawSelectionArea = (ctx: CanvasRenderingContext2D) => {
    if (selection.current == null) {
      return;
    }

    const { start, end } = selection.current;
    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#3399ff";
    ctx.fillRect(start.x, start.y, width, height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(start.x, start.y, width, height);
  };

  const drawSelectionContainer = (ctx: CanvasRenderingContext2D) => {
    if (isDragging.current || selectedShapesIds.current.length <= 1) {
      return;
    }

    const container = getSelectionContainer();

    if (container == null) {
      return;
    }

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
      container.position.x,
      container.position.y,
      container.width,
      container.height
    );
  };

  const drawShapeSelection = (shape: Shape, ctx: CanvasRenderingContext2D) => {
    const margin = 2;
    const { x, y } = getOffsetPosition(shape.position);

    ctx.beginPath();
    ctx.setLineDash([10, 5]);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
      x - margin,
      y - margin,
      shape.width + 2 * margin,
      shape.height + 2 * margin
    );
  };

  const drawSelection = (ctx: CanvasRenderingContext2D) => {
    drawSelectionArea(ctx);
    drawSelectionContainer(ctx);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    drawGrid(ctx);
    drawShapes(ctx);
    drawSelection(ctx);
  };

  return (
    <>
      <Canvas ref={canvasRef} draw={draw} />
      <ModesMenu currentMode={mode} onModeChange={setMode} />
    </>
  );
};
