import { FunctionComponent, ReactNode } from "react";
import "./ToolsOverlay.scss";

type ToolsOverlayProps = {
  children?: ReactNode;
};

export const ToolsOverlay: FunctionComponent<ToolsOverlayProps> = ({
  children,
}) => {
  return <div className="tools-overlay">{children}</div>;
};
