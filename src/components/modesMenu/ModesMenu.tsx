import { FunctionComponent, MouseEvent } from "react";
import { CursorIcon, MoveIcon, ShapesIcon } from "../../icons";
import { MenuOption } from "./MenuOption";
import "./ModesMenu.scss";

export enum Mode {
  Selection,
  Move,
  Line,
  Rectangle,
  Circle,
  CustomShape,
}

type ModesMenuProps = {
  currentMode: Mode;
  onModeChange: (mode: Mode) => void;
  onShapeDrag: (event: MouseEvent) => void;
};

export const ModesMenu: FunctionComponent<ModesMenuProps> = ({
  currentMode,
  onModeChange,
  onShapeDrag,
}) => {
  return (
    <div className="menu">
      <MenuOption
        icon={CursorIcon}
        selected={currentMode === Mode.Selection}
        onClick={() => onModeChange(Mode.Selection)}
      />
      <MenuOption
        icon={MoveIcon}
        selected={currentMode === Mode.Move}
        onClick={() => onModeChange(Mode.Move)}
      />
      <MenuOption
        icon={ShapesIcon}
        selected={currentMode === Mode.Rectangle}
        onClick={() => onModeChange(Mode.Rectangle)}
        onMouseDown={onShapeDrag}
      />
    </div>
  );
};
