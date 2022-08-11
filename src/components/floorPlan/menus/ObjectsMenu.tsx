import { FunctionComponent } from "react";
import { CameraIcon, LightBulbIcon } from "icons";
import { Menu } from "components/menu/Menu";
import { MenuOption } from "components/menu/MenuOption";
import { objects, ObjectType } from "../objects";

type ObjectsMenuProps = {
  onAddObject: (object: ObjectType) => void;
};

export const ObjectsMenu: FunctionComponent<ObjectsMenuProps> = ({
  onAddObject,
}) => {
  return (
    <Menu>
      <MenuOption
        icon={LightBulbIcon}
        onClick={() => onAddObject(objects.lamp)}
      />
      <MenuOption
        icon={CameraIcon}
        onClick={() => onAddObject(objects.camera)}
      />
    </Menu>
  );
};
