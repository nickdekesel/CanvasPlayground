import {
  Children,
  cloneElement,
  CSSProperties,
  forwardRef,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from "react";
import { IconProps } from "../../icons/Icon";
import "./ContextMenu.scss";

type ContextMenuProps = {
  style?: CSSProperties;
  children?: ReactNode;
};

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ style, children }, ref) => {
    const menuItemChildren = Children.toArray(children).filter(isMenuItemNode);

    return (
      <div className="context-menu" ref={ref} style={style}>
        {Children.map(menuItemChildren, (menuItem) =>
          cloneElement(menuItem, {
            onClick() {
              menuItem.props.onClick();
            },
          })
        )}
      </div>
    );
  }
);

type MenuItemProps = {
  label: string;
  icon: FunctionComponent<IconProps>;
  shortcut?: string;
  onClick: () => void;
};

export const MenuItem: FunctionComponent<MenuItemProps> = ({
  label,
  icon: Icon,
  shortcut,
  onClick,
}) => {
  return (
    <button className="menu-item" onClick={onClick}>
      <span className="content">
        <Icon className="icon" />
        <span className="text"> {label}</span>
      </span>
      {shortcut ? <span className="shortcut">{shortcut}</span> : null}
    </button>
  );
};

const isMenuItemNode = (node: ReactNode): node is ReactElement<MenuItemProps> =>
  Boolean(node && (node as ReactElement<MenuItemProps>).type === MenuItem);
