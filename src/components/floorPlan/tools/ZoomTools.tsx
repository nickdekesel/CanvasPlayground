import { FunctionComponent } from "react";
import { ToolsGroup } from "components/tools/ToolsGroup";
import { ToolsOption } from "components/tools/ToolsOption";
import { MinusIcon, PlusIcon } from "icons";

type ZoomToolsProps = {
  zoom?: number;
  onZoomChange: (zoom: number) => void;
};

const ZOOM_INTERVAL = 25;

export const ZoomTools: FunctionComponent<ZoomToolsProps> = ({
  zoom = 100,
  onZoomChange,
}) => (
  <ToolsGroup>
    <ToolsOption
      icon={MinusIcon}
      onClick={() => onZoomChange(zoom - ZOOM_INTERVAL)}
    />
    <ToolsOption
      icon={PlusIcon}
      onClick={() => onZoomChange(zoom + ZOOM_INTERVAL)}
    />
  </ToolsGroup>
);
