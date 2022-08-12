import { FunctionComponent, KeyboardEvent } from "react";

export type ToolsInputProps = {
  value: string;
  type?: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onEnter?: () => void;
};

export const ToolsInput: FunctionComponent<ToolsInputProps> = ({
  value,
  type = "text",
  min,
  max,
  onChange,
  onFocus,
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
      min={min}
      max={max}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyUp={handleKeyUp}
    />
  );
};
