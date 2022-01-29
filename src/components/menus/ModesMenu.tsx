import { FunctionComponent } from "react";

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
};

export const ModesMenu: FunctionComponent<ModesMenuProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="menu">
      <button onClick={() => onModeChange(Mode.Selection)}>Selection</button>
      <button onClick={() => onModeChange(Mode.Move)}>Move</button>
      <button onClick={() => onModeChange(Mode.Line)}>Line</button>
      <button onClick={() => onModeChange(Mode.Rectangle)}>Rectangle</button>
      <button onClick={() => onModeChange(Mode.Circle)}>Circle</button>
      <button onClick={() => onModeChange(Mode.CustomShape)}>
        Custom shape
      </button>
    </div>
  );
};
