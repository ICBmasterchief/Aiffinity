// frontend/src/hooks/useToast.js
import { useState, useCallback, useRef } from "react";

export default function useToast(max = 3) {
  const [toasts, setToasts] = useState([]);
  const seq = useRef(0);

  const showToast = useCallback(
    (msg, type = "error") => {
      setToasts((prev) => {
        const id = `${Date.now()}-${seq.current++}`;
        const next = [...prev, { id, msg, type }];
        return next.length > max ? next.slice(1) : next;
      });
    },
    [max]
  );

  const clearToast = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, showToast, clearToast };
}
