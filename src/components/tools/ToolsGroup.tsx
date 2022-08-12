import { Children, FunctionComponent, ReactElement, ReactNode } from "react";
import { ToolsOption, ToolsOptionProps } from "./ToolsOption";
import { ToolsInput, ToolsInputProps } from "./ToolsInput";
import "./Tools.scss";

type ToolsGroupProps = {
  direction?: "vertical" | "horizontal";
  children?: ReactNode;
};

export const ToolsGroup: FunctionComponent<ToolsGroupProps> = ({
  direction = "vertical",
  children,
}) => {
  const toolsOptionChildren =
    Children.toArray(children).filter(isValidToolsNode);

  return (
    <div className={`tools-group ${direction}`}>{toolsOptionChildren}</div>
  );
};

export const isValidToolsNode = (
  node: ReactNode
): node is ReactElement<ToolsOptionProps | ToolsInputProps> =>
  Boolean(
    node &&
      ((node as ReactElement<ToolsOptionProps>).type === ToolsOption ||
        (node as ReactElement<ToolsInputProps>).type === ToolsInput)
  );
