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

  const linkClasses = "hover:text-[#ae6fff] transition-colors";
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
        bg-[#d7daff]/70 backdrop-blur
        text-slate-800 shadow-md
        flex items-center justify-between
        px-4 md:px-8
      "
    >
      <h1 className="text-2xl font-bold">
        <Link href="/">AIffinity</Link>
      </h1>

      <div className="flex items-center">
        <span className="ml-2 md:hidden font-semibold">{`Hola, ${userName}`}</span>

        {user && (
          <nav className="hidden md:flex items-center space-x-6 font-semibold">
            <Link href="/discover" className={linkClasses}>
              Descubrir
            </Link>

            <Link href="/matches" className={`relative ${linkClasses}`}>
              Matches
              {unreadNotifs > 0 && (
                <span className={badgeClasses}>{unreadNotifs}</span>
              )}
            </Link>

            <Link href="/profile" className={linkClasses}>
              Perfil
            </Link>

            <Link href="/ai-quiz" className="hover:text-[#ae6fff]">
              AIffinity-Quiz
            </Link>

            <span className="ml-2 md:ml-4">{`Hola, ${userName}`}</span>
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
            flex flex-col items-end space-y-4 px-6 py-4 font-semibold
          "
          >
            <Link
              href="/discover"
              onClick={() => setOpen(false)}
              className={linkClasses}
            >
              Descubrir
            </Link>

            <Link
              href="/matches"
              onClick={() => setOpen(false)}
              className={`relative ${linkClasses}`}
            >
              Matches
              {unreadNotifs > 0 && (
                <span className={badgeClasses}>{unreadNotifs}</span>
              )}
            </Link>

            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className={linkClasses}
            >
              Perfil
            </Link>
            <Link
              href="/ai-quiz"
              onClick={() => setOpen(false)}
              className={linkClasses}
            >
              AIffinity-Quiz
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
