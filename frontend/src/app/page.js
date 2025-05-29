// frontend/src/app/page.js
"use client";

import { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AIFlag from "@/components/AIFlag";

function HomePage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <main
      className="
        flex flex-col items-center justify-center
        min-h-[calc(100vh-4rem)]
        text-center px-6
      "
    >
      <h1 className="text-6xl pb-20 -translate-x-4 font-bold select-none flex items-center ">
        <span className="relative translate-x-7 translate-y-2">
          <svg viewBox="0 0 100 90" className="w-32 h-32 drop-shadow">
            <defs>
              <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ae8dff" />
                <stop offset="100%" stopColor="#c7b5ff" />
              </linearGradient>
            </defs>
            <path
              d="M50 80 L10 40 A20 20 0 0 1 50 15 A20 20 0 0 1 90 40 Z"
              fill="url(#ai-grad)"
            />
            <text
              x="50"
              y="42"
              textAnchor="middle"
              fontSize="48"
              fontWeight="700"
              fill="white"
              dominantBaseline="middle"
            >
              AI
            </text>
          </svg>
        </span>
        <span className="font-bold z-10 drop-shadow-md bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5] bg-clip-text text-transparent">
          ffinity
          {user?.hasAIProfile && <AIFlag className="ml-0.5 inline-block" />}
        </span>
      </h1>

      <p
        className="
          max-w-xl text-lg sm:text-xl text-slate-700/90
          mb-10 leading-relaxed
        "
      >
        Descubre una nueva forma de conectar: la IA analiza tu personalidad y te
        ayuda a encontrar matches realmente afines &nbsp;
        <span className="whitespace-nowrap">
          (¡y a romper el hielo&nbsp;😉!)
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/discover"
          className="
            px-8 py-3 rounded-full font-semibold text-white text-lg
            shadow-lg transition
            bg-gradient-to-r from-[#B89CFF] to-[#CBA4FF]
            hover:from-[#CBA4FF] hover:to-[#B89CFF] hover:shadow-xl
          "
        >
          Empezar a descubrir
        </Link>

        <Link
          href="/ai-quiz"
          className="
            px-8 py-3 rounded-full font-semibold text-white text-lg
            shadow-lg transition
            bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5] backdrop-blur 
            hover:from-[#FFD3A5] hover:to-[#FF9A9E] hover:shadow-xl
          "
        >
          Crea tu perfil AIffinity
        </Link>
      </div>
    </main>
  );
}

export default ProtectedRoute(HomePage);
