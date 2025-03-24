// frontend/src/app/discover/page.js
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_RANDOM_USERS, LIKE_USER } from "@/graphql/swipeQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";

function DiscoverPage() {
  const { data, loading, error, refetch } = useQuery(GET_RANDOM_USERS);
  const [likeUser] = useMutation(LIKE_USER, {
    onCompleted: () => {
      // Al terminar de hacer like/dislike, refresca la lista
      refetch();
    },
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const users = data?.getRandomUsers || [];

  const handleLike = (targetUserId, liked) => {
    likeUser({ variables: { targetUserId, liked } });
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Descubre Usuarios</h1>
      {users.length === 0 && <p>No hay usuarios disponibles</p>}
      {users.map((u) => (
        <div key={u.id} className="border p-4 mb-4 rounded">
          <p className="font-bold">{u.name}</p>
          {u.photoUrl && (
            <img src={u.photoUrl} alt={u.name} className="max-h-64 mb-2" />
          )}
          <p>{u.description}</p>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() => handleLike(u.id, true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Like
            </button>
            <button
              onClick={() => handleLike(u.id, false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Dislike
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProtectedRoute(DiscoverPage);
