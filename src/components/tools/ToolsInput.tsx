import { FunctionComponent, KeyboardEvent } from "react";

export type ToolsInputProps = {
  value: string | number;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  width?: number | string;
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
  step,
  width,
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
      step={step}
      style={{ width }}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyUp={handleKeyUp}
    />
  );
};
