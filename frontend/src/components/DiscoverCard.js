// frontend/src/components/DiscoverCard.js
"use client";

import { useState } from "react";
import UserCarousel from "@/components/UserCarousel";
import { AiFillHeart } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import PhotoModal from "@/components/PhotoModal";

export default function DiscoverCard({ user, onLike }) {
  const [modalPhoto, setModalPhoto] = useState(false);

  const images =
    user.photos && user.photos.length > 0
      ? user.photos
      : [{ id: "main", filePath: user.mainPhoto }];

  return (
    <>
      <div className="relative w-full max-w-[32rem] aspect-[4/5] bg-[#d6b6ff]/40 rounded-3xl shadow-xl flex flex-col p-6 text-center">
        <div className="flex-1">
          <UserCarousel
            photos={images}
            onPhotoClick={(photo) => setModalPhoto(photo)}
          />
        </div>

        <h2 className="mt-4 w-full px-4 text-center font-bold leading-tight text-[clamp(1.1rem,4vw,1.75rem)] truncate">
          {user.name}, {user.age ?? "--"}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {user.description && (
            <p className="bg-white/60 backdrop-blur px-3 py-1 rounded-3xl text-sm">
              {user.description.trim()}
            </p>
          )}
        </div>

        <div className="sticky bottom-10 left-0 right-0 mt-6 flex justify-center gap-10 pointer-events-auto z-50">
          <button
            onClick={() => onLike(false)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            <IoClose size={36} className="text-rose-700" />
          </button>

          <button
            onClick={() => onLike(true)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            <AiFillHeart size={36} className="text-purple-600" />
          </button>
        </div>
      </div>
      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </>
  );
}
