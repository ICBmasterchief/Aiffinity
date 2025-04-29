// frontend/src/components/Header.js
"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNotifs } from "@/context/NotificationsContext";

export default function Header() {
  const { user } = useContext(AuthContext);
  const { notifs } = useNotifs();

  const unreadNotifs = notifs.filter(
    (n) => !(n.type === "match" && n.cleared)
  ).length;

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">
        <Link href="/">AIffinity</Link>
      </h1>

      {user ? (
        <nav className="flex items-center space-x-6">
          <Link href="/discover" className="hover:underline">
            Descubrir
          </Link>

          <Link href="/matches" className="relative hover:underline">
            Matches
            {unreadNotifs > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <Link href="/profile" className="hover:underline">
            Perfil
          </Link>

          <span className="ml-4">Hola, {user.name}</span>
        </nav>
      ) : (
        <nav className="flex items-center space-x-4">
          <Link href="/login" className="hover:underline">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="hover:underline">
            Registrarse
          </Link>
        </nav>
      )}
    </header>
  );
}
