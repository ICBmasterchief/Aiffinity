// frontend/src/app/discover/page.js
"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RANDOM_USER, LIKE_USER } from "@/graphql/swipeQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import DiscoverCard from "@/components/DiscoverCard";

function DiscoverPage() {
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
    <div className="min-h-screen flex items-center justify-center px-4">
      {candidate ? (
        <DiscoverCard
          user={candidate}
          onLike={(liked) =>
            likeUser({
              variables: { targetUserId: candidate.id, liked },
            })
          }
        />
      ) : (
        <p>No hay usuarios disponibles</p>
      )}
    </div>
  );
}

export default ProtectedRoute(DiscoverPage);
