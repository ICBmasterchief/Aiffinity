// frontend/src/components/CompatTag.js
"use client";

import { motion } from "framer-motion";

function colorFor(compat) {
  if (compat >= 80) return "bg-green-500";
  if (compat >= 60) return "bg-lime-500";
  if (compat >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

export default function CompatTag({ compat, className = "" }) {
  if (compat == null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colorFor(compat)} text-white
        px-4 py-1 rounded-2xl shadow-lg
        font-semibold text-sm ${className}`}
    >
      {compat}% compatible
    </motion.div>
  );
}
