// frontend/src/utils/useLockBodyScroll.js
import { useLayoutEffect } from "react";

export function useLockBodyScroll(locked = true) {
  useLayoutEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
