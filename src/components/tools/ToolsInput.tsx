import { FunctionComponent } from "react";

export type ToolsInputProps = {
  value: string;
  type?: string;
  onChange: (value: string) => void;
};

export const ToolsInput: FunctionComponent<ToolsInputProps> = ({
  value,
  type = "text",
  onChange,
}) => {
  return (
    <input
      className="tools-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
    />
  );
};
