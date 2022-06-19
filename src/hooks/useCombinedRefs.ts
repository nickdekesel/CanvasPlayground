import { MutableRefObject, Ref, useCallback } from "react";

export const useCombinedRefs = <T>(refs: Ref<T>[]) => {
  const combinedRef = useCallback(
    (node: T) => {
      for (let ref of refs) {
        if (ref == null) {
          return;
        }

        if (typeof ref === "function") {
          ref(node);
        } else {
          (ref as MutableRefObject<T>).current = node;
        }
      }
    },
    [refs]
  );

  return combinedRef;
};
