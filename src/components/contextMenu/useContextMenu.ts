import { RefObject, useCallback, useEffect, useRef } from "react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export const useContextMenu = (
  elementRef: RefObject<HTMLElement>,
  onShowContextMenu: (event: MouseEvent) => void,
  onHideContextMenu: () => void
) => {
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, onHideContextMenu);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      onShowContextMenu(event);
    },
    [onShowContextMenu]
  );

  useEffect(() => {
    const element = elementRef.current;
    element?.addEventListener("contextmenu", handleContextMenu);

    return () => element?.removeEventListener("contextmenu", handleContextMenu);
  }, [elementRef, handleContextMenu]);

  return { reference: contextMenuRef };
};
