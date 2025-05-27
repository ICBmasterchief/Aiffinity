// frontend/src/app/chat/[matchId]/page.js
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_MATCH_INFO } from "@/graphql/matchQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import Chat from "@/components/Chat";
import { photoUrl } from "@/utils/photoUrl";
import { motion } from "framer-motion";
import AIFlag from "@/components/AIFlag";

function ChatPage() {
  const { matchId } = useParams();
  const { data, loading, error } = useQuery(GET_MATCH_INFO, {
    variables: { matchId },
    fetchPolicy: "network-only",
  });

  if (loading)
    return <p className="text-center py-8">Cargando conversación...</p>;
  if (error) return <p className="text-center py-8">Error: {error.message}</p>;

  const chatPartner = data?.getMatchInfo?.user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
            max-w-3xl mx-auto my-8
            bg-white/60 backdrop-blur-md
            rounded-3xl shadow-lg
            flex flex-col h-[calc(100vh-10rem)]
            overflow-hidden
          "
    >
      <div className="flex items-center gap-3 p-4 border-b border-white/40">
        {chatPartner?.mainPhoto && (
          <img
            src={photoUrl(chatPartner.mainPhoto)}
            alt={chatPartner.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/70"
          />
        )}
        <h1
          className="
                text-lg font-bold drop-shadow-lg
                bg-gradient-to-r from-[#9d64ff] to-[#be8cff]
                bg-clip-text text-transparent
              "
        >
          Chat con {chatPartner ? chatPartner.name : "usuario"}{" "}
          {chatPartner?.hasAIProfile && <AIFlag />}
        </h1>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Chat matchId={matchId} chatPartner={chatPartner} />
      </div>
    </motion.div>
  );
}

export default ProtectedRoute(ChatPage);
