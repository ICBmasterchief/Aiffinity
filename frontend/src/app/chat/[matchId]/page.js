// frontend/src/app/chat/[matchId]/page.js
"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_MATCH_INFO } from "@/graphql/matchQueries";
import ProtectedRoute from "@/components/ProtectedRoute";
import Chat from "@/components/Chat";

function ChatPage() {
  const { matchId } = useParams();
  const { data, loading, error } = useQuery(GET_MATCH_INFO, {
    variables: { matchId },
    fetchPolicy: "network-only",
  });

  if (loading) return <p>Cargando conversación...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const chatPartner = data?.getMatchInfo?.user;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Chat con {chatPartner ? chatPartner.name : "usuario"}
      </h1>
      <Chat matchId={matchId} chatPartner={chatPartner} />
    </div>
  );
}

export default ProtectedRoute(ChatPage);
