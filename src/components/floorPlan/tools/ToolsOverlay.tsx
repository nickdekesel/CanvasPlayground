import { FunctionComponent, ReactNode } from "react";
import "./ToolsOverlay.scss";

type ToolsOverlayProps = {
  placement: "top-left" | "bottom-left";
  children?: ReactNode;
};

export const ToolsOverlay: FunctionComponent<ToolsOverlayProps> = ({
  placement,
  children,
}) => <div className={`tools-overlay ${placement}`}>{children}</div>;
