// frontend/src/components/Toast.js
"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function Toast({ toasts, clearToast }) {
  if (!toasts?.length) return null;

  return createPortal(
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50
                    flex flex-col items-center space-y-2"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
          >
            <ToastItem {...t} onClose={() => clearToast(t.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

function ToastItem({ msg, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === "error";
  const gradient = isError
    ? "from-[#FF6B6B] to-[#FF9A9E]"
    : "from-[#7EE8FA] to-[#EEC0C6]";

  const Icon = isError ? FiAlertCircle : FiCheckCircle;

  return (
    <div
      className="
        min-w-[220px] max-w-xs
        pl-3 pr-5 py-3
        rounded-2xl shadow-lg
        flex items-start gap-3
        bg-white/60 backdrop-blur-md
        ring-1 ring-white/40
      "
    >
      <div
        className={`
          flex-shrink-0 h-6 w-6 rounded-full
          bg-gradient-to-br ${gradient}
          grid place-content-center
        `}
      >
        <Icon size={14} color="white" />
      </div>
      <p className="text-sm leading-snug text-slate-800 break-words">{msg}</p>
    </div>
  );
}
