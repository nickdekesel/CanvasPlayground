import { FunctionComponent } from "react";
import { CursorIcon, MoveIcon, ShapesIcon } from "icons";
import { Menu } from "components/menu/Menu";
import { MenuOption } from "components/menu/MenuOption";

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

export const ModesMenu: FunctionComponent<ModesMenuProps> = ({
  currentMode,
  onModeChange,
  onShapeDrag,
}) => {
  return (
    <Menu>
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
        selected={currentMode === Mode.Circle}
        onClick={() => onModeChange(Mode.Circle)}
        onMouseDown={(event) => onShapeDrag(event.nativeEvent)}
      />
    </Menu>
  );
};
