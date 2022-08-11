import { FunctionComponent } from "react";
import { LightBulbIcon } from "icons";
import { Menu } from "components/menu/Menu";
import { MenuOption } from "components/menu/MenuOption";

type ObjectsMenuProps = {
  onLampClick: () => void;
};

export const ObjectsMenu: FunctionComponent<ObjectsMenuProps> = ({
  onLampClick,
}) => {
  return (
    <Menu>
      <MenuOption icon={LightBulbIcon} onClick={onLampClick} />
    </Menu>
  );
};
