// frontend/src/components/PhotoModal.js
"use client";
import { useLockBodyScroll } from "@/utils/useLockBodyScroll";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { photoUrl } from "@/utils/photoUrl";

export default function PhotoModal({ photo, onClose }) {
  useLockBodyScroll(true);

  const portalRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    portalRef.current = el;
    setReady(true);

    return () => {
      document.body.removeChild(el);
      portalRef.current = null;
    };
  }, []);

  if (!ready || !portalRef.current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center cursor-auto"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl leading-none"
      >
        ✕
      </button>

      <img
        src={
          typeof photo === "string" ? photoUrl(photo) : photoUrl(photo.filePath)
        }
        alt=""
        onClick={onClose}
        className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-xl"
      />
    </div>,
    portalRef.current
  );
}
