// frontend/src/app/user/[id]/page.js
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/userQueries";
import ProfileViewerCard from "@/components/ProfileViewerCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";

function UserViewer() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "network-only",
  });

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  return (
    <>
      <h1 className="text-2xl text-center m-4 font-bold drop-shadow-md text-slate-500">
        Perfil de {data?.getUser.name}:
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-[calc(100dvh-4rem)] pt-16 flex justify-center"
      >
        <ProfileViewerCard user={data.getUser} interactive={false} />
      </motion.div>
    </>
  );
}

export default ProtectedRoute(UserViewer);
