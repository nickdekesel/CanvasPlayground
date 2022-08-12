import { FunctionComponent } from "react";
import { CameraIcon, LightBulbIcon } from "icons";
import { objects, ObjectType } from "../objects";
import { ToolsGroup } from "components/tools/ToolsGroup";
import { ToolsOption } from "components/tools/ToolsOption";

type AddObjectToolsProps = {
  onAddObject: (object: ObjectType) => void;
};

export const AddObjectTools: FunctionComponent<AddObjectToolsProps> = ({
  onAddObject,
}) => (
  <ToolsGroup>
    <ToolsOption
      icon={LightBulbIcon}
      onClick={() => onAddObject(objects.lamp)}
    />
    <ToolsOption
      icon={CameraIcon}
      onClick={() => onAddObject(objects.camera)}
    />
  </ToolsGroup>
);
