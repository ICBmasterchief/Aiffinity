// src/components/Header.js
"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">
        <Link href="/">AIffinity</Link>
      </h1>
      <nav>
        {user ? (
          <p className="mr-4">Hola, {user.name}</p>
        ) : (
          <>
            <Link href="/login" className="mr-4 hover:underline">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="hover:underline">
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
