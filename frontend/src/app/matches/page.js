// frontend/src/app/matches/page.js
"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MATCHES } from "@/graphql/matchQueries";
import { MARK_NOTIFS_READ } from "@/graphql/notificationQueries";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useNotifs } from "@/context/NotificationsContext";
import { photoUrl } from "@/utils/photoUrl";

function MatchesPage() {
  const {
    clearNotifications,
    clearChatNotifications,
    clearMatchBadge,
    notifs,
  } = useNotifs();

  useEffect(() => {
    if (
      notifs.length > 0 &&
      notifs.some((n) => n.type === "match" && !n.cleared)
    ) {
      clearNotifications();
    }
  }, [notifs, clearNotifications]);

  const { data, loading, error } = useQuery(GET_MATCHES, {
    fetchPolicy: "network-only",
  });
  const [markRead] = useMutation(MARK_NOTIFS_READ);

  if (loading) return <p>Cargando matches...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const matches = data?.getMatches || [];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Matches</h1>
      {matches.length === 0 ? (
        <p>No tienes matches.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((m) => {
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
              <li
                key={m.id}
                className="border p-4 rounded flex items-center space-x-4"
              >
                <img
                  src={photoUrl(m.user.mainPhoto)}
                  alt={m.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div className="flex-1 flex items-center">
                  <span className="font-semibold">{m.user.name}</span>

                  {isNewMatch && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-green-500 text-white">
                      NUEVO
                    </span>
                  )}

                  {hasUnreadMsg && (
                    <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </div>

                <Link
                  href={`/chat/${m.id}`}
                  onClick={() => {
                    markRead({ variables: { matchId: m.id } });
                    clearChatNotifications(m.id);
                    clearMatchBadge(m.id);
                  }}
                >
                  <button className="px-4 py-2 bg-blue-500 text-white rounded">
                    Chatear
                  </button>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ProtectedRoute(MatchesPage);
