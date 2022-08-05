import { RefObject, useEffect, useState } from "react";

export const useDimensions = (elementRef: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (element == null) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length !== 1) {
        return;
      }

      const entry = entries[0];
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [elementRef]);

  return dimensions;
};
