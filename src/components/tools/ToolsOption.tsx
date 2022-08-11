import { FunctionComponent, MouseEvent, ReactElement, ReactNode } from "react";
import { IconProps } from "icons/Icon";

type ToolsOptionProps = {
  icon: FunctionComponent<IconProps>;
  selected?: boolean;
  onClick: () => void;
  onMouseDown?: (event: MouseEvent) => void;
};

export const ToolsOption: FunctionComponent<ToolsOptionProps> = ({
  icon: Icon,
  selected = false,
  onClick,
  onMouseDown,
}) => (
  <button
    className={`tools-option ${selected ? "selected" : ""}`}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    <Icon />
  </button>
);

export const isToolsOptionNode = (
  node: ReactNode
): node is ReactElement<ToolsOptionProps> =>
  Boolean(
    node && (node as ReactElement<ToolsOptionProps>).type === ToolsOption
  );
