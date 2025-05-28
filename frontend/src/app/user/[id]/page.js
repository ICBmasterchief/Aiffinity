// frontend/src/app/user/[id]/page.js
"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/userQueries";
import { GET_MATCH_INFO } from "@/graphql/matchQueries";
import ProfileViewerCard from "@/components/ProfileViewerCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import CompatTag from "@/components/CompatTag";

function UserViewer() {
  const { id } = useParams();
  const search = useSearchParams();
  const matchId = search.get("match");
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  const { data: matchData } = useQuery(GET_MATCH_INFO, {
    variables: { matchId },
    skip: !matchId,
    fetchPolicy: "network-only",
  });

  const compat = matchData?.getMatchInfo?.compat ?? null;

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full min-h-[calc(100dvh-4rem)] pt-2 flex items-center justify-center px-4"
      >
        <div className="w-full flex-col justify-items-center">
          <h1 className="text-2xl text-center pb-10 m-4 font-bold drop-shadow-md bg-gradient-to-r from-[#9d64ff] to-[#be8cff] bg-clip-text text-transparent">
            Perfil de {data?.getUser.name}:
          </h1>
          {compat !== null && (
            <CompatTag
              compat={compat}
              className="sticky top-[4.5rem] -mt-12 self-center z-20 pointer-events-none"
            />
          )}
          <div className="w-full mt-[4rem] flex-col justify-items-center">
            <ProfileViewerCard user={data.getUser} interactive={false} />
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default ProtectedRoute(UserViewer);
