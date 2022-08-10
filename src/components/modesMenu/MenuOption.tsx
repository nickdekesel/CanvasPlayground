import { FunctionComponent, MouseEvent } from "react";
import { IconProps } from "icons/Icon";

type MenuOptionProps = {
  icon: FunctionComponent<IconProps>;
  selected?: boolean;
  onClick: () => void;
  onMouseDown?: (event: MouseEvent) => void;
};

export const MenuOption: FunctionComponent<MenuOptionProps> = ({
  icon: Icon,
  selected = false,
  onClick,
  onMouseDown,
}) => {
  return (
    <button
      className={`menu-option ${selected ? "selected" : ""}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <Icon />
    </button>
  );
};
