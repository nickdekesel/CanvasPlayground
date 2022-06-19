import { useCallback, useState } from "react";

export const useElementState = <T>() => {
  const [element, setElement] = useState<T | null>(null);

  const ref = useCallback((node: T) => {
    if (node != null) {
      setElement(node);
    }
  }, []);
  return [element, ref] as const;
};
