// frontend/src/components/Toast.js
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ message, open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="
          fixed bottom-4 left-1/2 -translate-x-1/2 z-50
          bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg
        "
      >
        {message}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
