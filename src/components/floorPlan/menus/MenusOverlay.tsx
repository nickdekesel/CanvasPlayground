import { FunctionComponent, ReactNode } from "react";
import "./MenusOverlay.scss";

type MenusOverlayProps = {
  children?: ReactNode;
};

export const MenusOverlay: FunctionComponent<MenusOverlayProps> = ({
  children,
}) => {
  return <div className="menus-overlay">{children}</div>;
};
