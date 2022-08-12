import { FunctionComponent, KeyboardEvent } from "react";

export type ToolsInputProps = {
  value: string;
  type?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEnter?: () => void;
};

export const ToolsInput: FunctionComponent<ToolsInputProps> = ({
  value,
  type = "text",
  onChange,
  onBlur,
  onEnter,
}) => {
  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      onEnter?.();
    }
  };

  return (
    <input
      className="tools-input"
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyUp={handleKeyUp}
    />
  );
};
