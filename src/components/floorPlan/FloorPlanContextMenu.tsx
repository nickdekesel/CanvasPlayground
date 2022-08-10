import { CSSProperties, forwardRef } from "react";
import { DeleteIcon } from "icons/DeleteIcon";
import { GroupIcon } from "icons/GroupIcon";
import { ContextMenu, MenuItem } from "components/contextMenu/ContextMenu";

type FloorPlanContextMenuProps = {
  groupSelectedItems: () => void;
  deleteSelectedItems: () => void;
  style?: CSSProperties;
};

export const FloorPlanContextMenu = forwardRef<
  HTMLDivElement,
  FloorPlanContextMenuProps
>(({ groupSelectedItems, deleteSelectedItems, style }, ref) => (
  <ContextMenu style={style} ref={ref}>
    <MenuItem
      icon={GroupIcon}
      label="Group selection"
      shortcut="Ctrl+G"
      onClick={groupSelectedItems}
    />
    <MenuItem
      icon={DeleteIcon}
      label="Delete"
      shortcut="Delete"
      onClick={deleteSelectedItems}
    />
  </ContextMenu>
));
