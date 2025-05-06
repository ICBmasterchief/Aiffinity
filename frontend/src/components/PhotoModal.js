/* frontend/src/components/PhotoModal.js */
"use client";
import { useLockBodyScroll } from "@/utils/useLockBodyScroll";

export default function PhotoModal({ photo, onClose }) {
  useLockBodyScroll(true);

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center cursor-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl leading-none"
      >
        ✕
      </button>

      <img
        src={photo.filePath ?? photo}
        alt=""
        onClick={onClose}
        className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-xl"
      />
    </div>
  );
}
