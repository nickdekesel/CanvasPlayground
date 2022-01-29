import { FunctionComponent, useCallback, useState } from "react";
import { useDrag, Position } from "../hooks/useDrag";
import { Canvas } from "./Canvas";
import "./FloorPlan.scss";
import { Mode, ModesMenu } from "./menus/ModesMenu";

type Selection = { start: Position; end: Position };
type Color = string | "red" | "blue" | "green";
type Shape = { id: string; points: Position[]; fill: Color };
type SelectableShape = Shape & { selected: boolean };

const mockShapes: Shape[] = [
  {
    id: "0",
    points: [
      { x: 100, y: 200 },
      { x: 400, y: 200 },
      { x: 250, y: 400 },
    ],
    fill: "#FF0000",
  },
  {
    id: "1",
    points: [
      { x: 400, y: 300 },
      { x: 600, y: 300 },
      { x: 600, y: 500 },
      { x: 400, y: 500 },
    ],
    fill: "#0000FF",
  },
  {
    id: "2",
    points: [
      { x: 200, y: 200 },
      { x: 600, y: 300 },
    ],
    fill: "#000000",
  },
];

let shapeCount = mockShapes.length;

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
  const [selection, setSelection] = useState<Selection | null>(null);
  const [shapes, setShapes] = useState<SelectableShape[]>(
    mockShapes.map((s) => ({ ...s, selected: false }))
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

  const positionInShape = (position: Position, shape: Shape) => {
    if (shape.points.length === 0) {
      return false;
    }

    const { x, y } = position;
    const sortedXPositions = shape.points.map((p) => p.x).sort((a, b) => a - b);
    const minX = sortedXPositions[0];
    const maxX = sortedXPositions[sortedXPositions.length - 1];
    const sortedYPositions = shape.points.map((p) => p.y).sort((a, b) => a - b);
    const minY = sortedYPositions[0];
    const maxY = sortedYPositions[sortedYPositions.length - 1];

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  const findHoverOverShape = (position: Position) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (positionInShape(position, shape)) {
        return shape;
      }
    }
    return null;
  };

  const setSelectedShapes = (shapesToSelected: SelectableShape[]) => {
    setShapes((shapes) =>
      shapes.map((s) => ({
        ...s,
        selected: shapesToSelected.map((s) => s.id).includes(s.id),
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
            for (let point of shape.points) {
              point.x += delta.x;
              point.y += delta.y;
            }
          }
          setShapes(newShapes);
        } else {
          setSelection({ start, end });
        }
      } else if (mode === Mode.Line) {
        setNewShape({
          id: String(shapeCount++),
          points: [
            getInverseOffsetPosition(start),
            getInverseOffsetPosition(end),
          ],
          fill: "#00FF00",
        });
      } else if (mode === Mode.Rectangle) {
        const offsetStartPosition = getInverseOffsetPosition(start);
        const offsetEndPosition = getInverseOffsetPosition(end);

        setNewShape({
          id: String(shapeCount++),
          points: [
            offsetStartPosition,
            { x: offsetEndPosition.x, y: offsetStartPosition.y },
            offsetEndPosition,
            { x: offsetStartPosition.x, y: offsetEndPosition.y },
          ],
          fill: "#00FF00",
        });
      }
    },
    onDragEnd: () => {
      setSelection(null);
      if (newShape) {
        setShapes((shapes) => [...shapes, { ...newShape, selected: true }]);
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
      const allShapes: Shape[] = [...shapes];
      if (newShape) {
        allShapes.push(newShape);
      }

      for (let shape of allShapes) {
        const { points } = shape;
        if (points.length < 2) {
          continue;
        }

        ctx.beginPath();
        ctx.fillStyle = shape.fill;
        ctx.strokeStyle = shape.fill;
        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          const offsetPoint = getOffsetPosition(point);
          if (i === 0) {
            ctx.moveTo(offsetPoint.x, offsetPoint.y);
            continue;
          }
          ctx.lineTo(offsetPoint.x, offsetPoint.y);
        }

        if (points.length > 2) {
          ctx.fill();
        } else {
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
