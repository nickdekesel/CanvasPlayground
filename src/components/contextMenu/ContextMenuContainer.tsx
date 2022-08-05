import {
  cloneElement,
  FunctionComponent,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

type ContextMenuContainerProps = {
  elementRef: RefObject<HTMLElement | null>;
  contextMenu: ReactElement | ((event: MouseEvent) => ReactElement);
};

export const ContextMenuContainer: FunctionComponent<
  ContextMenuContainerProps
> = ({ elementRef, contextMenu }) => {
  const contextMenuRef = useRef<HTMLElement>(null);
  const [contextMenuToShow, setContextMenuToShow] =
    useState<ReactElement | null>(null);

  useOnClickOutside(contextMenuRef, () => setContextMenuToShow(null));

  const getContextMenu = useCallback(
    (event: MouseEvent) => {
      let menu;
      if (typeof contextMenu === "function") {
        menu = contextMenu(event);
      } else {
        menu = contextMenu;
      }

      return cloneElement(menu, {
        ref: contextMenuRef,
        style: {
          position: "absolute",
          top: event.clientY,
          left: event.clientX,
          zIndex: 1001,
        },
      });
    },
    [contextMenu]
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      const menu = getContextMenu(event);
      console.log(menu);
      setContextMenuToShow(menu);
    },
    [getContextMenu]
  );

  useEffect(() => {
    const element = elementRef.current;
    element?.addEventListener("contextmenu", handleContextMenu);

    return () => element?.removeEventListener("contextmenu", handleContextMenu);
  }, [elementRef, handleContextMenu]);

  if (!contextMenuToShow) {
    return null;
  }
  return createPortal(contextMenuToShow, document.body);
};
