// frontend/src/components/MatchModal.js
"use client";

import { photoUrl } from "@/utils/photoUrl";
import { motion, AnimatePresence } from "framer-motion";

export default function MatchModal({ matchedUser, onClose, onChat }) {
  if (!matchedUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="
            max-w-sm w-full p-8
            bg-white backdrop-blur-md
            rounded-3xl shadow-xl
            text-center
          "
        >
          <h2
            className="
              text-2xl font-bold mb-6 drop-shadow-lg
              bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
              bg-clip-text text-transparent
            "
          >
            ¡Match con {matchedUser.name}!
          </h2>

          <img
            src={photoUrl(matchedUser.mainPhoto)}
            alt={matchedUser.name}
            className="mx-auto w-40 h-40 object-cover rounded-full ring-4 ring-violet-200 shadow-lg mb-6"
          />

          <div className="flex justify-center gap-4">
            <button
              onClick={onChat}
              className="
                px-5 py-2 rounded-full font-medium text-white
                bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
                hover:from-[#FFD3A5] hover:to-[#FF9A9E]
                hover:shadow-md transition
              "
            >
              Ir al chat
            </button>
            <button
              onClick={onClose}
              className="
                px-5 py-2 rounded-full font-medium
                bg-gray-200 hover:bg-gray-300 text-slate-700
                hover:shadow-md transition
              "
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
