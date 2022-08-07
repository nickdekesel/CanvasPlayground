import {
  FunctionComponent,
  useCallback,
  useRef,
  useState,
  MouseEvent,
} from "react";
import { useDrag, MouseButton } from "../hooks/useDrag";
import { Canvas } from "./Canvas";
import { Mode, ModesMenu } from "./modesMenu/ModesMenu";
import { Line, Rectangle, Shape } from "../models/Shape";
import { areRectanglesOverlapping } from "../utils/rectangleUtils";
import { useHover } from "../hooks/useHover";
import { useFileDrop } from "../hooks/useFileDrop";
import { ContextMenuContainer } from "./contextMenu/ContextMenuContainer";
import { ContextMenu, MenuItem } from "./contextMenu/ContextMenu";
import { DeleteIcon } from "../icons/DeleteIcon";
import { GroupIcon } from "../icons/GroupIcon";
import { getInverseOffsetPosition, Position } from "../utils/positionUtils";
import { draw as drawFloorPlan } from "./drawFoorPlan";
import { getSelectionContainer, Selection } from "../utils/selectionUtils";
import "./FloorPlan.scss";

const mockShapes: Shape[] = [
  new Rectangle("0", { x: 200, y: 400 }, 200, 200, "#FF0000"),
  new Rectangle("1", { x: 500, y: 600 }, 300, 200, "#00FF00"),
  new Line("2", { x: 100, y: 200 }, 100, 100, "#FF0000"),
];

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const previousMode = useRef<Mode>(mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selection = useRef<Selection | null>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const shapes = useRef<Shape[]>(mockShapes);
  const selectedShapesIds = useRef<string[]>([]);
  const shapeIdsToSelect = useRef<string[]>([]);

  const newShape = useRef<Shape | null>(null);

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
    const selectionContainer = getSelectionContainer(
      shapes.current,
      selectedShapesIds.current,
      offset.current
    );
    return !!selectionContainer?.isInside(position);
  };

  const getShapesInSelectionArea = () => {
    if (selection.current == null) {
      return [];
    }

    const { start, end } = selection.current;
    const selectionArea = new Rectangle(
      "selection",
      getInverseOffsetPosition(start, offset.current),
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

  const { isDragging, triggerDrag } = useDrag(canvasRef, {
    onDragStart: ({ start, mouseButton }) => {
      isDragging.current = true;
      previousMode.current = mode;
      let dragMode = mode;

      if (mouseButton === MouseButton.Middle) {
        dragMode = Mode.Move;
        setMode(dragMode);
      }

      setCursor(start, dragMode);
      if (dragMode === Mode.Selection) {
        const hoveringOverSelection = isHoveringOverSelection(start);

        if (hoveringOverSelection) {
          return;
        }

        const hoverOverShape = findHoverOverShape(
          getInverseOffsetPosition(start, offset.current)
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
          getInverseOffsetPosition(start, offset.current),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      } else if (mode === Mode.Rectangle) {
        newShape.current = new Rectangle(
          String(shapes.current.length + 1),
          getInverseOffsetPosition(start, offset.current),
          end.x - start.x,
          end.y - start.y,
          "#00FF00"
        );
      }
    },
    onDragEnd: ({ end, mouseButton }) => {
      isDragging.current = false;

      setMode(previousMode.current);

      setCursor(end, previousMode.current);
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

  const handleShapeDrag = (event: MouseEvent) => {
    setMode(Mode.Rectangle);
    triggerDrag(event.nativeEvent);
  };

  useFileDrop(
    canvasRef,
    useCallback((event: DragEvent) => {
      if (!event.dataTransfer?.files.length) {
        return;
      }

      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (
          file?.name.endsWith(".jpeg") ||
          file?.name.endsWith(".jpg") ||
          file?.name.endsWith(".png")
        ) {
          createImageBitmap(file).then((bitMap) => {
            shapes.current.push(
              new Rectangle(
                String(shapes.current.length + 1),
                getInverseOffsetPosition(
                  {
                    x: event.clientX,
                    y: event.clientY,
                  },
                  offset.current
                ),
                bitMap.width / 5.0,
                bitMap.height / 5.0,
                "#000",
                bitMap
              )
            );
          });
        }
      }
    }, [])
  );

  const setDefaultCursor = (mode: Mode) => {
    const canvasElement = canvasRef.current;
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

  const setCursor = (position: Position, mode: Mode) => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    if (mode === Mode.Selection && isHoveringOverSelection(position)) {
      canvasElement.style.cursor = "move";
    } else {
      setDefaultCursor(mode);
    }
  };

  useHover(canvasRef, (position: Position) => setCursor(position, mode));

  const draw = (ctx: CanvasRenderingContext2D) =>
    drawFloorPlan(
      ctx,
      shapes.current,
      newShape.current,
      selectedShapesIds.current,
      shapeIdsToSelect.current,
      selection.current,
      offset.current,
      isDragging.current
    );

  const deleteSelectedItems = () => {
    shapes.current = shapes.current.filter(
      (s) => !selectedShapesIds.current.includes(s.id)
    );
  };

  const groupSelectedItems = () => {
    console.log("group");
  };

  return (
    <div className="floor-plan">
      <Canvas ref={canvasRef} draw={draw} />
      <ModesMenu
        currentMode={mode}
        onModeChange={setMode}
        onShapeDrag={handleShapeDrag}
      />
      <ContextMenuContainer
        elementRef={canvasRef}
        contextMenu={
          <ContextMenu>
            <MenuItem
              icon={GroupIcon}
              label="Group selection"
              shortcut="Ctrl+G"
              onClick={groupSelectedItems}
            />
            <MenuItem
              icon={DeleteIcon}
              label="Delete"
              shortcut="Delete"
              onClick={deleteSelectedItems}
            />
          </ContextMenu>
        }
      />
    </div>
  );
};
