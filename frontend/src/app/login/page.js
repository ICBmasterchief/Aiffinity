// src/app/login/page.js
"use client";

import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/userMutations";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      //console.log("Token recibido:", data.login); // Verificar el token aquí
      login(data.login);
      router.push("/chat");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({
      variables: {
        email: formState.email,
        password: formState.password,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col">
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
          Iniciar Sesión
        </button>
      </form>
      {loading && <p className="mt-4 text-gray-500">Cargando...</p>}
      {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}
    </div>
  );
}
