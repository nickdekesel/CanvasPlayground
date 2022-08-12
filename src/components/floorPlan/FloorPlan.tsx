import { FunctionComponent, useCallback, useRef, useState } from "react";
import { useFloating, shift, flip } from "@floating-ui/react-dom";
import { Circle, Line, Rectangle, Shape } from "models/Shape";
import { areRectanglesOverlapping } from "utils/rectangleUtils";
import { useDrag, MouseButton } from "hooks/useDrag";
import { useHover } from "hooks/useHover";
import { useFileDrop } from "hooks/useFileDrop";
import { useCombinedRefs } from "hooks/useCombinedRefs";
import { getInverseOffsetPosition, Position } from "utils/positionUtils";
import { getSelectionContainer, Selection } from "utils/selectionUtils";
import { Canvas } from "components/Canvas";
import { Mode, ModeTools } from "components/floorPlan/tools/ModeTools";
import { useContextMenu } from "components/contextMenu/useContextMenu";
import { draw as drawFloorPlan } from "./drawFoorPlan";
import { FloorPlanContextMenu } from "./FloorPlanContextMenu";
import { AddObjectTools } from "./tools/AddObjectTools";
import { ToolsOverlay } from "./tools/ToolsOverlay";
import { ObjectType } from "./objects";
import { ZoomTools } from "./tools/ZoomTools";
import { ObjectSizeTools } from "./tools/ObjectSizeTools";
import "./FloorPlan.scss";
import { images } from "utils/images";

export const FloorPlan: FunctionComponent = () => {
  const [mode, setMode] = useState<Mode>(Mode.Selection);
  const [zoom, setZoom] = useState(100);
  const [objectSize, setObjectSize] = useState(1);

  const previousMode = useRef<Mode>(mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selection = useRef<Selection | null>(null);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const shapes = useRef<Shape[]>([]);
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
      offset.current,
      objectSize
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
          ["#00FF00"]
        );
      } else if (mode === Mode.Rectangle) {
        newShape.current = new Rectangle(
          String(shapes.current.length + 1),
          getInverseOffsetPosition(start, offset.current),
          end.x - start.x,
          end.y - start.y,
          ["#00FF00"]
        );
      } else if (mode === Mode.Circle) {
        const diameter = end.x - start.x;
        newShape.current = new Circle(
          String(shapes.current.length + 1),
          getInverseOffsetPosition(start, offset.current),
          diameter,
          diameter,
          ["#0000FF"]
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
    setMode(Mode.Circle);
    triggerDrag(event);
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
            const imageKey = "uploadedFile";
            images[imageKey] = bitMap;
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
                bitMap.width,
                bitMap.height,
                [],
                imageKey
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
      isDragging.current,
      zoom / 100,
      objectSize
    );

  const deleteSelectedItems = () => {
    shapes.current = shapes.current.filter(
      (s) => !selectedShapesIds.current.includes(s.id)
    );
    setShowContextMenu(false);
  };

  const groupSelectedItems = () => {
    console.log("group");
    setShowContextMenu(false);
  };

  const [showContextMenu, setShowContextMenu] = useState(false);
  const {
    x: contextMenuX,
    y: contextMenuY,
    reference,
    floating: floatingContextMenuRef,
    strategy,
  } = useFloating({
    placement: "bottom-start",
    middleware: [shift(), flip()],
  });

  const handleShowContextMenu = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event;
      reference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: clientX,
            y: clientY,
            top: clientY,
            left: clientX,
            right: clientX,
            bottom: clientY,
          };
        },
      });
      setShowContextMenu(true);
    },
    [reference]
  );

  const { reference: contextMenuRef } = useContextMenu(
    canvasRef,
    handleShowContextMenu,
    () => setShowContextMenu(false)
  );

  const contextMenuRefs = useCombinedRefs<HTMLDivElement>([
    contextMenuRef,
    floatingContextMenuRef,
  ]);

  const getCanvasCenter = () => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return { x: 0, y: 0 };
    }

    const x = canvas.clientWidth / 2;
    const y = canvas.clientHeight / 2;
    return getInverseOffsetPosition({ x, y }, offset.current);
  };

  const handleAddObject = (object: ObjectType) => {
    const size = 64;
    const { x: centerX, y: centerY } = getCanvasCenter();
    const position = { x: centerX - size / 2, y: centerY - size / 2 };

    shapes.current = [
      ...shapes.current,
      new Circle(
        String(shapes.current.length + 1),
        position,
        size,
        size,
        ["#FFFFFF", "#000000"],
        object.image
      ),
    ];
  };

  return (
    <div className="floor-plan">
      <Canvas ref={canvasRef} draw={draw} />
      <ToolsOverlay placement="top-left">
        <ModeTools
          currentMode={mode}
          onModeChange={setMode}
          onShapeDrag={handleShapeDrag}
        />
        <AddObjectTools onAddObject={handleAddObject} />
      </ToolsOverlay>
      <ToolsOverlay placement="bottom-left">
        <ZoomTools zoom={zoom} onZoomChange={setZoom} />
        <ObjectSizeTools size={objectSize} onSizeChange={setObjectSize} />
      </ToolsOverlay>

      {showContextMenu && (
        <FloorPlanContextMenu
          ref={contextMenuRefs}
          style={{
            position: strategy,
            top: contextMenuY ?? 0,
            left: contextMenuX ?? 0,
          }}
          groupSelectedItems={groupSelectedItems}
          deleteSelectedItems={deleteSelectedItems}
        />
      )}
    </div>
  );
};
