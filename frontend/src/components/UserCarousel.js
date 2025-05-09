// frontend/src/components/UserCarousel.js
"use client";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { photoUrl } from "@/utils/photoUrl";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function UserCarousel({ photos = [], onPhotoClick }) {
  const [active, setActive] = useState(0);
  const [isSwipingPhoto, setIsSwipingPhoto] = useState(false);

  const size = photos.length || 1;
  const go = (dir) => setActive((i) => (i + dir + size) % size);

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      if (Math.abs(deltaX) > 5) setIsSwipingPhoto(true);
    },
    onSwipedLeft: () => {
      go(1);
      setIsSwipingPhoto(false);
    },
    onSwipedRight: () => {
      go(-1);
      setIsSwipingPhoto(false);
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative w-full h-full aspect-[4/5] cursor-grab active:cursor-grabbing touch-pan-y"
    >
      {photos.map((p, idx) => {
        const offset = ((idx - active + size) % size) - 1;
        const z = idx === active ? 30 : 10 + offset;
        const scale = idx === active ? "scale-100" : "scale-75";
        const rotate =
          offset === -1
            ? "-rotate-[4deg]"
            : offset === 1
            ? "rotate-[4deg]"
            : "";

        return (
          <img
            key={p.id ?? idx}
            src={photoUrl(p.filePath)}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={
              idx === active
                ? () => {
                    if (isSwipingPhoto) return;
                    onPhotoClick?.(p, idx);
                  }
                : undefined
            }
            className={`absolute inset-0 w-full h-full transition-all duration-300 object-cover rounded-xl shadow-lg ${scale} ${rotate}`}
            style={{ zIndex: z }}
            alt=""
          />
        );
      })}

      {size === 0 && (
        <img src={photoUrl("")} className="object-cover rounded-xl shadow-lg" />
      )}

      <button
        onClick={() => go(-1)}
        className="hidden md:flex items-center justify-center
              absolute left-2 top-1/2 -translate-y-1/2
              w-10 h-10 bg-white/70 hover:bg-white shadow rounded-full
              backdrop-blur z-40"
      >
        <IoChevronBack size={24} />
      </button>

      <button
        onClick={() => go(1)}
        className="hidden md:flex items-center justify-center
              absolute right-2 top-1/2 -translate-y-1/2
              w-10 h-10 bg-white/70 hover:bg-white shadow rounded-full
              backdrop-blur z-40"
      >
        <IoChevronForward size={24} />
      </button>
    </div>
  );
}
