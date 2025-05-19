// frontend/src/components/AuthCard.js
import { motion } from "framer-motion";

export default function AuthCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        max-w-md mx-auto mt-12
        bg-white/60 backdrop-blur-md
        rounded-3xl shadow-lg p-8
      "
    >
      <h1
        className="
          text-2xl font-bold mb-6 text-center
          bg-gradient-to-r from-[#B89CFF] to-[#E8D7FF]
          bg-clip-text text-transparent
        "
      >
        {title}
      </h1>
      {children}
    </motion.div>
  );
}
