// frontend/src/app/page.js
"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

function HomePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.email}</h1>
      <button
        onClick={logout}
        className="mb-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
      {/* <Link
        href="/chat"
        className="inline-block ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Ir al Chat
      </Link> */}
    </div>
  );
}

export default ProtectedRoute(HomePage);
