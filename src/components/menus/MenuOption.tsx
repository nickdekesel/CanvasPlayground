import { FunctionComponent } from "react";
import { IconProps } from "../../icons/Icon";

type MenuOptionProps = {
  icon: FunctionComponent<IconProps>;
  selected?: boolean;
  onClick: () => void;
};

export const MenuOption: FunctionComponent<MenuOptionProps> = ({
  icon: Icon,
  selected = false,
  onClick,
}) => {
  return (
    <button
      className={`menu-option ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};
