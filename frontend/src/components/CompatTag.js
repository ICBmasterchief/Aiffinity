// frontend/src/components/CompatTag.js
"use client";

import { motion } from "framer-motion";

function colorFor(compat) {
  if (compat >= 80)
    return "bg-gradient-to-r from-[#5ce51a] to-[#add633] text-slate-800";
  if (compat >= 60)
    return "bg-gradient-to-r from-[#add633] to-[#ddde21] text-slate-800";
  if (compat >= 40)
    return "bg-gradient-to-r from-[#ddde21] to-[#ffd934] text-slate-800";
  if (compat >= 20)
    return "bg-gradient-to-r from-[#ffd934] to-[#ffb234] text-slate-800";
  return "bg-gradient-to-r from-[#ffb234] to-[#ff8c5a] text-slate-800";
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
