// frontend/src/app/matches/page.js
"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MATCHES } from "@/graphql/matchQueries";
import { MARK_NOTIFS_READ } from "@/graphql/notificationQueries";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useNotifs } from "@/context/NotificationsContext";
import { photoUrl } from "@/utils/photoUrl";
import { motion } from "framer-motion";
import Toast from "@/components/Toast";
import useToast from "@/hooks/useToast";
import { DELETE_MATCH } from "@/graphql/matchMutations";
import { IoClose } from "react-icons/io5";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import AIFlag from "@/components/AIFlag";

function MatchesPage() {
  const {
    clearNotifications,
    clearChatNotifications,
    clearMatchBadge,
    notifs,
  } = useNotifs();

  const [matchToDelete, setMatchToDelete] = useState(null);

  const { toasts, showToast, clearToast } = useToast();

  useEffect(() => {
    if (
      notifs.length > 0 &&
      notifs.some((n) => n.type === "match" && !n.cleared)
    ) {
      clearNotifications();
    }
  }, [notifs, clearNotifications]);

  const { data, loading, error, refetch } = useQuery(GET_MATCHES, {
    fetchPolicy: "network-only",
  });
  const [markRead] = useMutation(MARK_NOTIFS_READ);

  const [deleteMatch] = useMutation(DELETE_MATCH, {
    onCompleted: () => {
      showToast("Match eliminado", "success");
      refetch();
    },
    onError: (err) => showToast(err.message),
  });

  if (loading) return <p className="text-center py-8">Cargando matches...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  const matches = data?.getMatches || [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Matches</h1>
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No tienes matches.</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 max-[450px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
        >
          {matches.map((m, index) => {
            const hasUnreadMsg = notifs.some(
              (n) =>
                n.type === "message" &&
                String(n.payload.matchId) === String(m.id)
            );
            const isNewMatch = notifs.some(
              (n) =>
                n.type === "match" &&
                !n.seen &&
                String(n.payload.matchId) === String(m.id)
            );
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-white/60 rounded-xl shadow-sm p-4
                  flex flex-col justify-between items-center text-center
                  hover:shadow-md transition-shadow h-full
                "
              >
                <button
                  onClick={() => setMatchToDelete(m.id)}
                  className="
                    absolute top-2 right-2 z-10
                  bg-white/80 backdrop-blur p-1 rounded-full shadow
                  hover:bg-white transition
                  "
                  aria-label="Eliminar match"
                >
                  <IoClose size={14} className="text-gray-500" />
                </button>
                <div className="flex flex-col items-center">
                  {isNewMatch && (
                    <span className="absolute top-2 left-2 px-1 py-0.5 bg-green-500 text-white text-xs font-semibold rounded">
                      NUEVO
                    </span>
                  )}
                  <Link
                    href={`/user/${m.user.id}`}
                    scroll={false}
                    className="relative group"
                  >
                    <img
                      src={photoUrl(m.user.mainPhoto)}
                      alt={m.user.name}
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-violet-200 transition duration-200 group-hover:brightness-75"
                    />
                    <span
                      className="
                        absolute inset-0 flex items-center justify-center
                      text-white text-sm font-semibold
                        opacity-0 group-hover:opacity-100 transition
                      "
                    >
                      Ver perfil
                    </span>
                  </Link>
                  <h2 className="mt-2 text-lg font-medium leading-snug">
                    {m.user.name}
                    {m.user.hasAIProfile && <AIFlag />}
                  </h2>
                </div>
                <Link
                  href={`/chat/${m.id}`}
                  onClick={() => {
                    markRead({ variables: { matchId: m.id } });
                    clearChatNotifications(m.id);
                    clearMatchBadge(m.id);
                  }}
                  className="relative"
                >
                  <button
                    className="
                      mt-2 px-4 py-1 w-full 
                      bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5] 
                    text-white text-sm font-medium rounded-full 
                    hover:from-[#FFD3A5] hover:to-[#FF9A9E] 
                      hover:shadow-md hover:scale-105 transition 
                    "
                  >
                    Chatear
                  </button>
                  {hasUnreadMsg && (
                    <span
                      className="
                        absolute top-1/2 -translate-y-1/2 -right-2
                        w-2 h-2 -mx-1 mt-1 bg-red-500 rounded-full
                        pointer-events-none
                      "
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
      {matchToDelete && (
        <ConfirmDeleteModal
          onCancel={() => setMatchToDelete(null)}
          onConfirm={() => {
            deleteMatch({ variables: { matchId: matchToDelete } });
            setMatchToDelete(null);
          }}
        />
      )}
      <Toast toasts={toasts} clearToast={clearToast} />
    </div>
  );
}

export default ProtectedRoute(MatchesPage);
