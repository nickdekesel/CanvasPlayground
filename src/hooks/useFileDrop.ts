import { RefObject, useCallback, useEffect } from "react";

export const useFileDrop = (
  elementRef: RefObject<HTMLElement>,
  onDrop: (event: DragEvent) => void
) => {
  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();

      onDrop(event);
    },
    [onDrop]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (element == null) {
      return;
    }

    element.addEventListener("dragenter", handleDragEnter);
    element.addEventListener("dragleave", handleDragLeave);
    element.addEventListener("dragover", handleDragOver);
    element.addEventListener("drop", handleDrop);

    return () => {
      element.removeEventListener("dragenter", handleDragEnter);
      element.removeEventListener("dragleave", handleDragLeave);
      element.removeEventListener("dragover", handleDragOver);
      element.removeEventListener("drop", handleDrop);
    };
  }, [elementRef, handleDrop]);
};
