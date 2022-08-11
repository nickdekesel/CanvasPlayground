import { FunctionComponent } from "react";
import { CursorIcon, MoveIcon, ShapesIcon } from "icons";
import { ToolsGroup } from "components/tools/ToolsGroup";
import { ToolsOption } from "components/tools/ToolsOption";

export enum Mode {
  Selection,
  Move,
  Line,
  Rectangle,
  Circle,
  CustomShape,
  Lamp,
}

type ModesMenuProps = {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  onShapeDrag: (event: MouseEvent) => void;
};

export const ModeTools: FunctionComponent<ModesMenuProps> = ({
  currentMode,
  onModeChange,
  onShapeDrag,
}) => {
  return (
    <ToolsGroup>
      <ToolsOption
        icon={CursorIcon}
        selected={currentMode === Mode.Selection}
        onClick={() => onModeChange(Mode.Selection)}
      />
      <ToolsOption
        icon={MoveIcon}
        selected={currentMode === Mode.Move}
        onClick={() => onModeChange(Mode.Move)}
      />
      <ToolsOption
        icon={ShapesIcon}
        selected={currentMode === Mode.Circle}
        onClick={() => onModeChange(Mode.Circle)}
        onMouseDown={(event) => onShapeDrag(event.nativeEvent)}
      />
    </ToolsGroup>
  );
};
