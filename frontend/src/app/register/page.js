// src/app/register/page.js
"use client";

import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "@/graphql/userMutations";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { loading, error }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      // Aquí puedes redirigir al usuario o mostrar un mensaje
      router.push("/login");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({
      variables: {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          type="text"
          placeholder="Nombre"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
          className="mb-4 p-2 border rounded text-black"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
          required
          className="mb-4 p-2 border rounded text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formState.password}
          onChange={(e) =>
            setFormState({ ...formState, password: e.target.value })
          }
          required
          className="mb-4 p-2 border rounded text-black"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrarse
        </button>
      </form>
      {loading && <p className="mt-4 text-gray-500">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
    </div>
  );
}
