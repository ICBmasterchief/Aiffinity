// frontend/src/app/matches/page.js
"use client";

import { useQuery } from "@apollo/client";
import { GET_MATCHES } from "@/graphql/matchQueries";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

function MatchesPage() {
  const { data, loading, error } = useQuery(GET_MATCHES);

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
          {matches.map((match) => (
            <li
              key={match.id}
              className="border p-4 rounded flex items-center space-x-4"
            >
              {match.photoUrl && (
                <img
                  src={match.photoUrl}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{match.name}</p>
              </div>
              <Link href={`/chat/${match.id}`}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded">
                  Chatear
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProtectedRoute(MatchesPage);
