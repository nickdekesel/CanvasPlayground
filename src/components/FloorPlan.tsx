import { FunctionComponent, useRef, useState } from "react";
import { useDrag, Position } from "../hooks/useDrag";
import { Canvas } from "./Canvas";
import { Mode, ModesMenu } from "./menus/ModesMenu";
import { Line, Rectangle, Shape } from "./Shape";
import "./FloorPlan.scss";
import { useElementState } from "../hooks/useElementState";

type Selection = { start: Position; end: Position };

const mockShapes: Shape[] = [
  new Rectangle("0", { x: 200, y: 400 }, 200, 200, "#FF0000"),
  new Rectangle("1", { x: 500, y: 600 }, 300, 200, "#00FF00"),
  new Line("2", { x: 100, y: 200 }, 100, 100, "#FF0000"),
];

let shapeCount = mockShapes.length;

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const [canvasElement, canvasRef] =
    useElementState<HTMLCanvasElement | null>();

  const selection = useRef<Selection | null>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const shapes = useRef<Shape[]>(mockShapes);
  const selectedShapes = useRef<string[]>([]);

  const newShape = useRef<Shape | null>(null);

  const getOffsetPosition = (position: Position) => ({
    x: offset.current.x + position.x,
    y: offset.current.y + position.y,
  });

  const getInverseOffsetPosition = (position: Position) => ({
    x: position.x - offset.current.x,
    y: position.y - offset.current.y,
  });

  const findHoverOverShape = (position: Position) => {
    for (let i = shapes.current.length - 1; i >= 0; i--) {
      const shape = shapes.current[i];
      if (shape.isInside(position)) {
        return shape;
      }
    }
    return null;
  };

  useDrag(canvasElement, {
    onDragStart: ({ start }) => {
      if (mode === Mode.Selection) {
        const hoverOverShape = findHoverOverShape(
          getInverseOffsetPosition(start)
        );
        if (hoverOverShape) {
          selectedShapes.current = [hoverOverShape.id];
        } else {
          selectedShapes.current = [];
        }
      }
    },
    onDrag: ({ start, end, delta }) => {
      if (mode === Mode.Move) {
        offset.current = {
          x: offset.current.x + delta.x,
          y: offset.current.y + delta.y,
        };
      } else if (mode === Mode.Selection) {
        if (selectedShapes.current.length) {
          const newShapes = [...shapes.current];
          for (let shape of newShapes) {
            if (!selectedShapes.current.includes(shape.id)) {
              continue;
            }

            shape.position.x += delta.x;
            shape.position.y += delta.y;
          }
          shapes.current = newShapes;
        } else {
          selection.current = { start, end };
        }
      } else if (mode === Mode.Line) {
        newShape.current = new Line(
          String(shapeCount++),
          getInverseOffsetPosition(start),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      } else if (mode === Mode.Rectangle) {
        newShape.current = new Rectangle(
          String(shapeCount++),
          getInverseOffsetPosition(start),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      }
    },
    onDragEnd: () => {
      selection.current = null;
      if (newShape.current) {
        shapes.current = [...shapes.current, newShape.current];
        newShape.current = null;
      }
    },
  });

  const drawSelection = (ctx: CanvasRenderingContext2D) => {
    if (selection.current == null) {
      return;
    }

    const { start, end } = selection.current;
    const width = end.x - start.x;
    const height = end.y - start.y;

    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#3399ff";
    ctx.fillRect(start.x, start.y, width, height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#0000ff";
    ctx.lineWidth = 1;
    ctx.strokeRect(start.x, start.y, width, height);
  };

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    const allShapes: Shape[] = [...shapes.current];
    if (newShape.current) {
      allShapes.push(newShape.current);
    }

    for (let shape of allShapes) {
      const offsetPoint = getOffsetPosition(shape.position);
      if (shape instanceof Rectangle) {
        ctx.fillStyle = shape.fill;
        ctx.fillRect(offsetPoint.x, offsetPoint.y, shape.width, shape.height);
      } else if (shape instanceof Line) {
        ctx.strokeStyle = shape.fill;
        ctx.moveTo(offsetPoint.x, offsetPoint.y);
        ctx.lineTo(offsetPoint.x + shape.width, offsetPoint.y + shape.height);
        ctx.stroke();
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
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
