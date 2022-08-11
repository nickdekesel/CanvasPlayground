import { FunctionComponent, MouseEvent, ReactElement, ReactNode } from "react";
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

export const isMenuOptionNode = (
  node: ReactNode
): node is ReactElement<MenuOptionProps> =>
  Boolean(node && (node as ReactElement<MenuOptionProps>).type === MenuOption);
