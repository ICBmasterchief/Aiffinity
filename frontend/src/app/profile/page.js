// frontend/src/app/profile/page.js
"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { GET_USER } from "@/graphql/userQueries";
import { UPDATE_PROFILE } from "@/graphql/userMutations";
import PhotoGrid from "@/components/PhotoGrid";
import { motion } from "framer-motion";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [editingPhotos, setEditingPhotos] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    age: 0,
    gender: "",
    searchGender: "",
  });

  const descriptionRef = useRef(null);
  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 192)}px`;
    }
  }, [formData.description]);

  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id: user?.userId },
    fetchPolicy: "network-only",
    skip: !user,
  });

  const [updateProfile, { loading: updating }] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data) => {
      alert("Perfil actualizado!");
      refetch();
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
        searchGender: data.getUser.searchGender || "",
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
        searchGender: formData.searchGender,
      },
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl p-8 mx-auto my-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-lg grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold drop-shadow-md mb-4 bg-gradient-to-r from-[#B89CFF] to-[#E8D7FF] bg-clip-text text-transparent">
          Tus Fotos
        </h2>{" "}
        <PhotoGrid photos={data.getUser.photos} refetchProfile={refetch} />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold drop-shadow-md mb-4 bg-gradient-to-r from-[#B89CFF] to-[#E8D7FF] bg-clip-text text-transparent">
          Editar Perfil
        </h2>{" "}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              ref={descriptionRef}
              rows={1}
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur p-3
                             focus:outline-none focus:border-purple-500 focus:ring-0 resize-none overflow-y-auto max-h-48"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Edad
              </label>
              <input
                type="number"
                className="mt-1 w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur p-3
                               focus:outline-none focus:border-purple-500 focus:ring-0"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                required
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Género
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                required
                className="mt-1 w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur p-3
                               focus:outline-none focus:border-purple-500 focus:ring-0"
              >
                <option value="">Selecciona tu género</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Busco
            </label>
            <select
              value={formData.searchGender}
              onChange={(e) =>
                setFormData({ ...formData, searchGender: e.target.value })
              }
              required
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-white/70 backdrop-blur p-3
                             focus:outline-none focus:border-purple-500 focus:ring-0"
            >
              <option value="">Selecciona una opción</option>
              <option value="hombres">Hombres</option>
              <option value="mujeres">Mujeres</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full py-3 bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
                           rounded-full text-white font-semibold
                           hover:from-[#FFD3A5] hover:to-[#FF9A9E] hover:shadow-md transition"
          >
            {updating ? "Actualizando…" : "Guardar Perfil"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default ProtectedRoute(ProfilePage);
