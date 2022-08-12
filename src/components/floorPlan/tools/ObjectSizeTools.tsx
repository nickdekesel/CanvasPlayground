import { ToolsGroup } from "components/tools/ToolsGroup";
import { ToolsInput } from "components/tools/ToolsInput";
import { FunctionComponent } from "react";

type ObjectSizeToolsProps = {
  size: number;
  onSizeChange: (size: number) => void;
};

const MIN_OBJECT_SIZE = 0;
const MAX_OBJECT_SIZE = 2;
export const OBJECT_SCALES = [0.5, 0.75, 1];

export const ObjectSizeTools: FunctionComponent<ObjectSizeToolsProps> = ({
  size,
  onSizeChange,
}) => {
  const handleInputChange = (value: string) => {
    const size = Math.max(
      MIN_OBJECT_SIZE,
      Math.min(MAX_OBJECT_SIZE, parseInt(value))
    );
    onSizeChange(size);
  };

  return (
    <ToolsGroup direction="horizontal">
      <ToolsInput
        value={size}
        type="range"
        min={MIN_OBJECT_SIZE}
        max={MAX_OBJECT_SIZE}
        step={1}
        onChange={handleInputChange}
      />
    </ToolsGroup>
  );
};
