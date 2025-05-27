// frontend/src/components/Header.js
"use client";

import Link from "next/link";
import { useState, useContext, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { GET_USER } from "@/graphql/userQueries";
import { useQuery } from "@apollo/client";
import { AuthContext } from "@/context/AuthContext";
import { useNotifs } from "@/context/NotificationsContext";

export default function Header() {
  const { user } = useContext(AuthContext);
  const { notifs } = useNotifs();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { data } = useQuery(GET_USER, {
    variables: { id: user?.userId },
    fetchPolicy: "network-only",
    skip: !user,
  });
  const userName = data?.getUser.name;

  const unreadNotifs = notifs.filter(
    (n) => !(n.type === "match" && n.cleared)
  ).length;

  const navBtn =
    "relative px-4 py-2 rounded-lg font-medium transition-colors " +
    "hover:bg-[#c7c9ff] hover:text-[#6b37ff] focus:outline-none";

  const mobBtn =
    "w-full text-right px-6 py-3 rounded-lg transition-colors " +
    "hover:bg-[#c7c9ff]/70 hover:text-[#6b37ff]";

  const badgeClasses =
    "absolute -top-2 -right-3 bg-red-500 text-xs w-5 h-5 flex items-center " +
    "justify-center rounded-full text-white";

  useEffect(() => {
    if (!open) return;

    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  return (
    <header
      ref={menuRef}
      className="
        sticky top-0 z-30 h-16
         bg-[#e4e6ff]/60 backdrop-blur
        text-slate-800 shadow-md
        flex items-center justify-between
        px-4 md:px-8
      "
    >
      <Link href="/">
        <h1 className="text-3xl font-bold select-none flex items-center ">
          <span className="relative translate-x-3 translate-y-1">
            <svg viewBox="0 0 100 90" className="w-16 h-16 drop-shadow">
              <defs>
                <linearGradient
                  id="ai-grad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
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
          </span>
        </h1>
      </Link>

      <div className="flex items-center">
        <span className="mr-2 md:hidden text-lg font-semibold drop-shadow-sm bg-gradient-to-r from-[#9d64ff] to-[#be8cff] bg-clip-text text-transparent">
          {userName && `Hola, ${userName}`}
        </span>

        {user && (
          <nav className="hidden md:flex items-center space-x-6 font-semibold">
            <Link href="/discover" className={navBtn}>
              Descubrir
            </Link>

            <Link href="/matches" className={`relative ${navBtn}`}>
              Matches
              {unreadNotifs > 0 && (
                <span className={badgeClasses}>{unreadNotifs}</span>
              )}
            </Link>

            <Link href="/profile" className={navBtn}>
              Perfil
            </Link>

            <Link href="/ai-quiz" className={navBtn}>
              AIffinity-Quiz
            </Link>

            <span className="ml-2 md:ml-4 text-lg font-semibold drop-shadow-sm bg-gradient-to-r from-[#9d64ff] to-[#be8cff] bg-clip-text text-transparent">
              {userName && `Hola, ${userName}`}
            </span>
          </nav>
        )}

        {user && (
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            className="relative md:hidden p-2 -mr-2"
          >
            {open ? <FiX size={28} /> : <FiMenu size={28} />}
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" />
            )}
          </button>
        )}

        {open && (
          <nav
            className="
            absolute inset-x-0 top-full md:hidden
            bg-[#d7daff]/90 backdrop-blur
            shadow-lg border-t border-white/40
            flex flex-col items-end space-y-2 py-4 font-semibold
          "
          >
            <Link
              href="/discover"
              onClick={() => setOpen(false)}
              className={mobBtn}
            >
              Descubrir
            </Link>

            <Link
              href="/matches"
              onClick={() => setOpen(false)}
              className={`relative ${mobBtn}`}
            >
              Matches
              {unreadNotifs > 0 && (
                <span className={badgeClasses}>{unreadNotifs}</span>
              )}
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className={mobBtn}
            >
              Perfil
            </Link>
            <Link
              href="/ai-quiz"
              onClick={() => setOpen(false)}
              className={mobBtn}
            >
              AIffinity-Quiz
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
