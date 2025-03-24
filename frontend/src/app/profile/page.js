// frontend/src/app/profile/page.js
"use client";

import { useState, useEffect, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { GET_USER, UPDATE_PROFILE } from "@/graphql/userQueries";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    description: "",
    age: 0,
    gender: "",
    photoUrl: "",
  });

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: user?.userId },
    skip: !user,
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data) => {
      alert("Perfil actualizado!");
    },
    onError: (err) => {
      console.error("Error actualizando perfil:", err);
    },
  });

  useEffect(() => {
    if (data?.getUser) {
      setFormData({
        description: data.getUser.description || "",
        age: data.getUser.age || 0,
        gender: data.getUser.gender || "",
        photoUrl: data.getUser.photoUrl || "",
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      variables: {
        description: formData.description,
        age: parseInt(formData.age),
        gender: formData.gender,
        photoUrl: formData.photoUrl,
      },
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Tu Perfil</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label>
          Descripción:
          <textarea
            className="border rounded w-full p-2 text-black"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </label>
        <label>
          Edad:
          <input
            type="number"
            className="border rounded w-full p-2 text-black"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </label>
        <label>
          Género:
          <input
            type="text"
            className="border rounded w-full p-2 text-black"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          />
        </label>
        <label>
          Foto (URL):
          <input
            type="text"
            className="border rounded w-full p-2 text-black"
            value={formData.photoUrl}
            onChange={(e) =>
              setFormData({ ...formData, photoUrl: e.target.value })
            }
          />
        </label>
        <button
          type="submit"
          disabled={updating}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {updating ? "Actualizando..." : "Guardar Perfil"}
        </button>
      </form>
    </div>
  );
}

export default ProtectedRoute(ProfilePage);
