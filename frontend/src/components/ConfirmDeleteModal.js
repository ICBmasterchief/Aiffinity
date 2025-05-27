// frontend/src/components/ConfirmDeleteModal.js
"use client";

export default function ConfirmDeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-6 w-80 text-center">
        <h3 className="text-lg font-semibold mb-4">¿Eliminar este match?</h3>
        <p className="text-sm text-slate-700 mb-6">
          Se borrará también el chat y las notificaciones.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="
                px-4 py-2 text-white rounded-full
                bg-gradient-to-r from-rose-500 to-rose-400
                hover:from-rose-400 hover:to-rose-500 transition
              "
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
