// frontend/src/components/DiscoverCard.js
"use client";

import { useState, useEffect } from "react";
import UserCarousel from "@/components/UserCarousel";
import { AiFillHeart } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import PhotoModal from "@/components/PhotoModal";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";

const DURATION = 0.35;

export default function DiscoverCard({ user, onLike, onAnimEnd }) {
  const [modalPhoto, setModalPhoto] = useState(false);
  const [allowCardDrag, setAllowCardDrag] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const controls = useAnimation();
  const dragX = useMotionValue(0);
  const dragRotation = useTransform(dragX, [-160, 0, 160], [-15, 0, 15]);
  const likeScale = useTransform(dragX, [0, 15], [1, 1.6]);
  const dislikeScale = useTransform(dragX, [-15, 0], [1.6, 1]);

  useEffect(() => {
    controls.set({ x: 0, rotate: 0, scale: 0.8, opacity: 0 });
    controls.start({
      scale: 1,
      opacity: 1,
      transition: { duration: DURATION },
    });
  }, [controls]);

  const images =
    user.photos && user.photos.length > 0
      ? user.photos
      : [{ id: "main", filePath: user.mainPhoto }];

  const hasMultiple = images.length > 1;

  const swipe = async (dir) => {
    await controls.start({
      x: dir * 420,
      rotate: dir * 14,
      opacity: 0,
      transition: { duration: DURATION },
    });
    controls.set({ x: 0, rotate: 0, scale: 0.8, opacity: 0 });
    onLike(dir === 1);
    onAnimEnd?.();
  };

  return (
    <>
      <motion.div
        style={{ x: dragX, rotate: dragRotation }}
        transition={{ duration: DURATION }}
        drag="x"
        onDragStart={() => setIsDragging(true)}
        dragListener={allowCardDrag}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x > 120) swipe(1);
          else if (info.offset.x < -120) swipe(-1);
          else
            controls.start({ x: 0, rotate: 0, transition: { duration: 0.2 } });
          setTimeout(() => setIsDragging(false), 0);
        }}
        animate={controls}
        className="relative -mt-14 mb-2 w-full max-w-[24rem] aspect-[4/5] bg-[#e8d7ff]/60 backdrop-blur-md
                   rounded-3xl shadow-xl flex flex-col p-6 text-center"
      >
        <div
          className="flex-1"
          onPointerDownCapture={() => {
            setAllowCardDrag(!hasMultiple ? true : false);
          }}
          onPointerUpCapture={() => setAllowCardDrag(true)}
          onPointerCancelCapture={() => setAllowCardDrag(true)}
        >
          <UserCarousel
            photos={images}
            onPhotoClick={(photo) => {
              if (!isDragging) setModalPhoto(photo);
            }}
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
          <motion.button
            style={{ scale: dislikeScale }}
            whileHover={{ scale: 1.3 }}
            onClick={() => swipe(-1)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition"
          >
            <IoClose size={36} className="text-rose-400" />
          </motion.button>

          <motion.button
            style={{ scale: likeScale }}
            whileHover={{ scale: 1.3 }}
            onClick={() => swipe(1)}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transition"
          >
            <AiFillHeart size={36} className="text-purple-500" />
          </motion.button>
        </div>
      </motion.div>
      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </>
  );
}
