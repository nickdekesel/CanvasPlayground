import { RefObject, useLayoutEffect } from "react";

export const useOnClickOutside = (
  elementRef: RefObject<HTMLElement>,
  handler?: (event: MouseEvent | TouchEvent) => void
) => {
  useLayoutEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!handler) {
        return;
      }

      if (elementRef.current?.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [elementRef, handler]);
};
