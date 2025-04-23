// frontend/src/app/discover/page.js
"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RANDOM_USER, LIKE_USER } from "@/graphql/swipeQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import MatchModal from "@/components/MatchModal";
import { useRouter } from "next/navigation";

function DiscoverPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_RANDOM_USER);
  const candidate = data?.getRandomUser;

  const [showModal, setShowModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [matchId, setMatchId] = useState(null);

  const [likeUser] = useMutation(LIKE_USER, {
    onCompleted: ({ likeUser }) => {
      const { matchCreated, matchedUser, matchId } = likeUser;
      if (matchCreated) {
        setMatchedUser(matchedUser);
        setMatchId(matchId);
        setShowModal(true);
      }
      refetch();
    },
    onError: (error) => console.error(error),
  });

  const handleChat = () => {
    setShowModal(false);
    router.push(`/chat/${matchId}`);
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Descubre Usuarios</h1>
      {!candidate && <p>No hay usuarios disponibles</p>}
      {candidate && (
        <div key={candidate.id} className="border p-4 mb-4 rounded">
          <p className="font-bold">{candidate.name}</p>
          {candidate.photoUrl && (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="max-h-64 mb-2"
            />
          )}
          <div className="flex space-x-4 mt-2">
            <button
              onClick={() =>
                likeUser({
                  variables: { targetUserId: candidate.id, liked: true },
                })
              }
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Like
            </button>
            <button
              onClick={() =>
                likeUser({
                  variables: { targetUserId: candidate.id, liked: false },
                })
              }
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Dislike
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <MatchModal
          matchedUser={matchedUser}
          onClose={() => setShowModal(false)}
          onChat={handleChat}
        />
      )}
    </div>
  );
}

export default ProtectedRoute(DiscoverPage);
