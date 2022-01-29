import { FunctionComponent, useCallback, useState } from "react";
import { useDrag, Position } from "../hooks/useDrag";
import { Canvas } from "./Canvas";
import "./FloorPlan.scss";
import { Mode, ModesMenu } from "./menus/ModesMenu";
import { Line, Rectangle, Shape } from "./Shape";

type Selection = { start: Position; end: Position };

type SelectableShape = { shape: Shape; selected: boolean };

const mockShapes: Shape[] = [
  new Rectangle("0", { x: 200, y: 400 }, 200, 400, "#FF0000"),
  new Rectangle("1", { x: 500, y: 600 }, 300, 200, "#00FF00"),
  new Line("2", { x: 100, y: 200 }, 100, 100, "#FF0000"),
];

let shapeCount = mockShapes.length;

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [shapes, setShapes] = useState<SelectableShape[]>(
    mockShapes.map((s) => ({ shape: s, selected: false }))
  );

  const [newShape, setNewShape] = useState<Shape | null>(null);

  const getOffsetPosition = useCallback(
    (position: Position) => ({
      x: offset.x + position.x,
      y: offset.y + position.y,
    }),
    [offset]
  );

  const getInverseOffsetPosition = useCallback(
    (position: Position) => ({
      x: position.x - offset.x,
      y: position.y - offset.y,
    }),
    [offset]
  );

  const findHoverOverShape = (position: Position) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (shape.shape.isInside(position)) {
        return shape;
      }
    }
    return null;
  };

  const setSelectedShapes = (shapesToSelected: SelectableShape[]) => {
    setShapes((shapes) =>
      shapes.map(({ shape }) => ({
        shape,
        selected: shapesToSelected
          .map(({ shape }) => shape.id)
          .includes(shape.id),
      }))
    );
  };

  const getSelectedShapes = () => {
    return shapes.filter((s) => s.selected);
  };

  useDrag({
    onDragStart: ({ start }) => {
      if (mode === Mode.Selection) {
        const hoverOverShape = findHoverOverShape(
          getInverseOffsetPosition(start)
        );
        if (hoverOverShape) {
          setSelectedShapes([hoverOverShape]);
        } else {
          setSelectedShapes([]);
        }
      }
    },
    onDrag: ({ start, end, delta }) => {
      if (mode === Mode.Move) {
        setOffset((offset) => {
          const newOffsetX = offset.x + delta.x;
          const newOffsetY = offset.y + delta.y;
          return { x: newOffsetX, y: newOffsetY };
        });
      } else if (mode === Mode.Selection) {
        const selectedShapes = getSelectedShapes();
        const newShapes = [...shapes];
        if (selectedShapes.length) {
          for (let shape of newShapes) {
            if (!shape.selected) {
              continue;
            }

            shape.shape.position.x += delta.x;
            shape.shape.position.y += delta.y;
          }
          setShapes(newShapes);
        } else {
          setSelection({ start, end });
        }
      } else if (mode === Mode.Line) {
        setNewShape(
          new Line(
            String(shapeCount++),
            getInverseOffsetPosition(start),
            end.x - start.x,
            end.y - start.y,
            "#00FF00"
          )
        );
      } else if (mode === Mode.Rectangle) {
        setNewShape(
          new Rectangle(
            String(shapeCount++),
            getInverseOffsetPosition(start),
            end.x - start.x,
            end.y - start.y,
            "#00FF00"
          )
        );
      }
    },
    onDragEnd: () => {
      setSelection(null);
      if (newShape) {
        setShapes((shapes) => [...shapes, { shape: newShape, selected: true }]);
        setNewShape(null);
      }
    },
  });

  const drawSelection = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (selection == null) {
        return;
      }

      const { start, end } = selection;
      const width = end.x - start.x;
      const height = end.y - start.y;

      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#3399ff";
      ctx.fillRect(start.x, start.y, width, height);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#0000ff";
      ctx.lineWidth = 1;
      ctx.strokeRect(start.x, start.y, width, height);
    },
    [selection]
  );

  const drawShapes = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const allShapes: Shape[] = [...shapes.map((s) => s.shape)];
      if (newShape) {
        allShapes.push(newShape);
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
    },
    [shapes, newShape, getOffsetPosition]
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawShapes(ctx);
      drawSelection(ctx);
    },
    [drawShapes, drawSelection]
  );

  return (
    <>
      <Canvas draw={draw} />
      <ModesMenu currentMode={mode} onModeChange={setMode} />
    </>
  );
};
