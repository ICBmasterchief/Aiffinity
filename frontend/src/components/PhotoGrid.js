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
import PhotoModal from "@/components/PhotoModal";
import { IoClose } from "react-icons/io5";
import { FiEdit2, FiCheck } from "react-icons/fi";
import Toast from "@/components/Toast";

function SortableItem({ photo, index, onDelete, onClickPhoto, editable }) {
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
        onClick={onClickPhoto}
        className={
          isMain
            ? "w-60 h-60 object-cover rounded-lg"
            : "w-28 h-28 object-cover rounded"
        }
        {...attributes}
        {...listeners}
      />

      {editable && (
        <button
          type="button"
          aria-label="Eliminar foto"
          onClick={() => onDelete(photo.id)}
          className="
            absolute top-1.5 right-1.5 z-10
            p-[3px] rounded-full
            bg-white/80 text-gray-700 backdrop-blur-sm
            ring-1 ring-gray-300 shadow
            hover:bg-white hover:scale-105 transition
          "
        >
          <IoClose size={14} />
        </button>
      )}
    </div>
  );
}

export default function PhotoGrid({
  photos,
  refetchProfile,
  showToast = () => {},
}) {
  const [items, setItems] = useState(photos ?? []);
  const [editing, setEditing] = useState(false);
  const [modalPhoto, setModalPhoto] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const MAX = 10;

  useEffect(() => setItems(photos ?? []), [photos]);

  useEffect(() => {
    if (items.length === 0 && editing) setEditing(false);
  }, [items, editing]);

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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
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

    if (items.length + files.length > MAX) {
      showToast(`Máximo ${MAX} fotos`);
      e.target.value = "";
      return;
    }

    try {
      await uploadPhotos({ variables: { files } });
    } catch (err) {
      const gqlMsg = err?.graphQLErrors?.[0]?.message;
      setErrorMsg(gqlMsg || "Error subiendo foto");
    }
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
      <label className="block mb-2 font-semibold">
        Fotos ({items.length}/{MAX})
      </label>

      <div className="my-4 flex items-center gap-4 justify-center md:justify-start">
        <input
          id="photo-upload-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFiles}
          className="hidden"
        />

        <label
          htmlFor="photo-upload-input"
          className="
            inline-block py-2 px-5 
            bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
            text-white font-medium 
            rounded-full cursor-pointer
            hover:from-[#FFD3A5] hover:to-[#FF9A9E] hover:shadow-md
            transition
          "
        >
          Elegir archivos
        </label>

        {items.length > 0 && (
          <button
            type="button"
            aria-label={editing ? "Terminar edición" : "Editar fotos"}
            onClick={() => setEditing(!editing)}
            className="
            p-2 rounded-full bg-white/80 backdrop-blur
            ring-1 ring-gray-300 shadow hover:bg-white
            transition
          "
          >
            {editing ? <FiCheck size={18} /> : <FiEdit2 size={18} />}
          </button>
        )}
      </div>

      {editing && (
        <p className="mb-2 text-sm text-gray-600 text-center md:text-left">
          Arrastra para reordenar o pulsa la ✕ para eliminar.
        </p>
      )}

      {editing ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div
              className="grid gap-2 justify-center"
              style={{
                gridTemplateColumns: "repeat(auto-fill, 7rem)",
                gridAutoRows: "7rem",
              }}
            >
              {items.map((p, idx) => (
                <SortableItem
                  key={p.id}
                  photo={p}
                  index={idx}
                  onDelete={handleDelete}
                  onClickPhoto={() => setModalPhoto(p)}
                  editable={editing}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div
          className="grid gap-2 justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fill, 7rem)",
            gridAutoRows: "7rem",
          }}
        >
          {items.map((p, idx) => (
            <img
              key={p.id}
              src={photoUrl(p.filePath)}
              alt=""
              draggable={false}
              onClick={() => setModalPhoto(p)}
              className={
                idx === 0
                  ? "w-58 h-58 object-cover rounded-lg col-span-2 row-span-2"
                  : "w-28 h-28 object-cover rounded"
              }
            />
          ))}
        </div>
      )}

      <Toast
        open={Boolean(errorMsg)}
        message={errorMsg}
        onClose={() => setErrorMsg("")}
      />

      {modalPhoto && (
        <PhotoModal photo={modalPhoto} onClose={() => setModalPhoto(null)} />
      )}
    </div>
  );
}
