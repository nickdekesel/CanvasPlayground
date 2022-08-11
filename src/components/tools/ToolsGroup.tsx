import { Children, FunctionComponent, ReactNode } from "react";
import { isToolsOptionNode } from "./ToolsOption";
import "./ToolsGroup.scss";

export enum Mode {
  Selection,
  Move,
  Line,
  Rectangle,
  Circle,
  CustomShape,
  Lamp,
}

type ToolsGroupProps = {
  children?: ReactNode;
};

export const ToolsGroup: FunctionComponent<ToolsGroupProps> = ({
  children,
}) => {
  const toolsOptionChildren =
    Children.toArray(children).filter(isToolsOptionNode);

  return <div className="tools-group">{toolsOptionChildren}</div>;
};
