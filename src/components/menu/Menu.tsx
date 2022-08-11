import { Children, FunctionComponent, ReactNode } from "react";
import { isMenuOptionNode } from "./MenuOption";
import "./Menu.scss";

export enum Mode {
  Selection,
  Move,
  Line,
  Rectangle,
  Circle,
  CustomShape,
  Lamp,
}

type MenuProps = {
  children?: ReactNode;
};

export const Menu: FunctionComponent<MenuProps> = ({ children }) => {
  const menuOptionChildren =
    Children.toArray(children).filter(isMenuOptionNode);

  return <div className="menu">{menuOptionChildren}</div>;
};
