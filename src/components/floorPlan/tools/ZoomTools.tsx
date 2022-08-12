import { FunctionComponent, useEffect, useState } from "react";
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
  const [zoomInputValue, setZoomInputValue] = useState(() => String(zoom));
  const [isFocussed, setIsFocussed] = useState(false);

  useEffect(() => {
    setZoomInputValue(String(zoom));
  }, [zoom]);

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

  const submitZoomInput = () => {
    const zoomValue = parseInt(zoomInputValue);
    if (isNaN(zoomValue)) {
      setZoomInputValue(String(zoom));
    } else {
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomValue));
      onZoomChange(newZoom);
    }
  };

  const handleBlur = () => {
    setIsFocussed(false);
    submitZoomInput();
  };

  let zoomInputText = zoomInputValue.replaceAll("%", "");
  if (!isFocussed) {
    zoomInputText += "%";
  }

  return (
    <ToolsGroup direction="horizontal">
      <ToolsOption icon={MinusIcon} onClick={decreaseZoom} />
      <ToolsInput
        value={zoomInputText}
        type={isFocussed ? "number" : "text"}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        onChange={setZoomInputValue}
        onFocus={() => setIsFocussed(true)}
        onBlur={handleBlur}
        onEnter={submitZoomInput}
      />
      <ToolsOption icon={PlusIcon} onClick={increaseZoom} />
    </ToolsGroup>
  );
};
