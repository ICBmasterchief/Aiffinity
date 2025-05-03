// frontend/src/components/MatchModal.js
"use client";

import { photoUrl } from "@/utils/photoUrl";

export default function MatchModal({ matchedUser, onClose, onChat }) {
  if (!matchedUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-4">
          ¡Has hecho match con {matchedUser.name}!
        </h2>
        <img
          src={photoUrl(matchedUser.mainPhoto)}
          alt={matchedUser.name}
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
          <button
            onClick={onChat}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Ir al Chat
          </button>
        </div>
      </div>
    </div>
  );
}
