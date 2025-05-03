// frontend/src/components/PhotoGrid.js
"use client";

import { useMutation } from "@apollo/client";
import {
  UPLOAD_PHOTOS,
  DELETE_PHOTO,
  REORDER_PHOTOS,
} from "@/graphql/photoMutations";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { photoUrl } from "@/utils/photoUrl";

function SortableItem({ photo, index, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.id });

  const isMain = index === 0;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        "relative select-none " + (isMain ? "col-span-2 row-span-2" : "")
      }
    >
      <img
        draggable={false}
        src={photoUrl(photo.filePath)}
        alt=""
        className={
          isMain
            ? "w-60 h-60 object-cover rounded-lg"
            : "w-28 h-28 object-cover rounded"
        }
        {...attributes}
        {...listeners}
      />

      <button
        type="button"
        onClick={() => onDelete(photo.id)}
        className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

export default function PhotoGrid({ photos, refetchProfile }) {
  const [items, setItems] = useState(photos ?? []);
  useEffect(() => setItems(photos ?? []), [photos]);

  const [uploadPhotos] = useMutation(UPLOAD_PHOTOS, {
    onCompleted: refetchProfile,
  });
  const [deletePhoto] = useMutation(DELETE_PHOTO, {
    onCompleted: refetchProfile,
  });
  const [reorderPhotos] = useMutation(REORDER_PHOTOS, {
    onCompleted: refetchProfile,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    await uploadPhotos({ variables: { files } });
    e.target.value = "";
  };

  const handleDelete = (photoId) => deletePhoto({ variables: { photoId } });

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);

    const newArr = arrayMove(items, oldIdx, newIdx);
    setItems(newArr);

    await reorderPhotos({
      variables: { order: newArr.map((p) => p.id) },
    });
  };

  return (
    <div>
      <label className="block mb-2 font-semibold">Fotos (máx 10):</label>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="mb-4"
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 auto-rows-[7rem] gap-2">
            {items.map((p, idx) => (
              <SortableItem
                key={p.id}
                photo={p}
                index={idx}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
