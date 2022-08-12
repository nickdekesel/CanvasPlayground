import { FunctionComponent } from "react";
import { ToolsGroup } from "components/tools/ToolsGroup";
import { ToolsOption } from "components/tools/ToolsOption";
import { MinusIcon, PlusIcon } from "icons";
import { ToolsInput } from "components/tools/ToolsInput";

type ZoomToolsProps = {
  zoom?: number;
  onZoomChange: (zoom: number) => void;
};

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const ZOOM_INTERVAL = 25;

export const ZoomTools: FunctionComponent<ZoomToolsProps> = ({
  zoom = 100,
  onZoomChange,
}) => {
  const decreaseZoom = () => {
    const delta = zoom % ZOOM_INTERVAL || ZOOM_INTERVAL;
    const newZoom = Math.max(MIN_ZOOM, zoom - delta);
    onZoomChange(newZoom);
  };

  const increaseZoom = () => {
    const delta = ZOOM_INTERVAL - (zoom % ZOOM_INTERVAL);
    const newZoom = Math.min(MAX_ZOOM, zoom + delta);
    onZoomChange(newZoom);
  };

  const handleInputChange = (value: string) => {
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, parseInt(value)));
    onZoomChange(newZoom);
  };

  return (
    <ToolsGroup direction="horizontal">
      <ToolsOption icon={MinusIcon} onClick={decreaseZoom} />
      <ToolsInput
        value={String(zoom)}
        type="number"
        onChange={handleInputChange}
      />
      <ToolsOption icon={PlusIcon} onClick={increaseZoom} />
    </ToolsGroup>
  );
};
