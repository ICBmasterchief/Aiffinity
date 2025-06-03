// frontend/src/app/discover/page.js
"use client";

import { useQuery, useMutation } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import { LIKE_USER } from "@/graphql/swipeQueries";
import { GET_COMPATIBLE } from "@/graphql/discoverQueries";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileViewerCard from "@/components/ProfileViewerCard";
import { useState } from "react";
import MatchModal from "@/components/MatchModal";
import { useRouter } from "next/navigation";
import CompatTag from "@/components/CompatTag";

function DiscoverPage() {
  const [localMatch, setLocalMatch] = useState(null);
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(GET_COMPATIBLE, {
    fetchPolicy: "network-only",
  });
  const candidate = data?.getCompatibleCandidate?.user;
  const compat = data?.getCompatibleCandidate?.compat ?? null;

  const [likeUser] = useMutation(LIKE_USER, {
    onCompleted: ({ likeUser }) => {
      if (likeUser.matchCreated) {
        setLocalMatch({
          id: likeUser.matchId,
          name: likeUser.matchedUser.name,
          mainPhoto: likeUser.matchedUser.mainPhoto,
        });
      } else {
        sessionStorage.removeItem("skipNextMatchNotif");
      }
      refetch();
    },
    onError: (error) => console.error(error),
  });

  if (loading) return <p className="text-center py-8">Cargando usuarios...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  return (
    <>
      <div className="relative w-full min-h-[calc(100dvh-4rem)] pt-16 flex items-center justify-center px-4">
        <AnimatePresence>
          {candidate ? (
            <div className="w-full flex-col justify-items-center">
              <CompatTag
                compat={compat}
                className="sticky top-[4.5rem] -mt-12 self-center z-20 pointer-events-none"
              />
              <div className="w-full mt-[4rem] flex-col justify-items-center">
                <ProfileViewerCard
                  key={candidate.id}
                  user={candidate}
                  onLike={(liked) => {
                    if (liked) {
                      sessionStorage.setItem("skipNextMatchNotif", "1");
                    }
                    likeUser({
                      variables: { targetUserId: candidate.id, liked },
                    });
                  }}
                />
              </div>
            </div>
          ) : (
            <p>No hay usuarios disponibles</p>
          )}
        </AnimatePresence>
      </div>
      {localMatch && (
        <MatchModal
          matchedUser={localMatch}
          onClose={() => setLocalMatch(null)}
          onChat={() => {
            router.push(`/chat/${localMatch.id}`);
            setLocalMatch(null);
          }}
        />
      )}
    </>
  );
}

export default ProtectedRoute(DiscoverPage);
