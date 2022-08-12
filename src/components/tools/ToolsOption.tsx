import { FunctionComponent, MouseEvent } from "react";
import { IconProps } from "icons/Icon";

export type ToolsOptionProps = {
  icon: FunctionComponent<IconProps>;
  selected?: boolean;
  onClick: () => void;
  onMouseDown?: (event: MouseEvent) => void;
};

export const ToolsOption: FunctionComponent<ToolsOptionProps> = ({
  icon: Icon,
  selected = false,
  onClick,
  onMouseDown,
}) => (
  <button
    className={`tools-option ${selected ? "selected" : ""}`}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    <Icon />
  </button>
);
