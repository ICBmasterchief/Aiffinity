// frontend/src/app/discover/page.js
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RANDOM_USER, LIKE_USER } from "@/graphql/swipeQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { photoUrl } from "@/utils/photoUrl";

function DiscoverPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_RANDOM_USER, {
    fetchPolicy: "network-only",
  });
  const candidate = data?.getRandomUser;

  const [likeUser] = useMutation(LIKE_USER, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => console.error(error),
  });

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Descubre Usuarios</h1>
      {!candidate && <p>No hay usuarios disponibles</p>}
      {candidate && (
        <div key={candidate.id} className="border p-4 mb-4 rounded">
          <p className="font-bold">{candidate.name}</p>
          <img
            src={photoUrl(candidate.mainPhoto)}
            alt={candidate.name}
            className="max-h-64 mb-2"
          />
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
    </div>
  );
}

export default ProtectedRoute(DiscoverPage);
