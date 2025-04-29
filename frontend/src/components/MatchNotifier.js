// frontend/src/components/MatchNotifier.js
"use client";

import { useEffect, useState, useContext } from "react";
import { useSubscription } from "@apollo/client";
import { NOTIF_SUBS } from "@/graphql/notificationQueries";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import MatchModal from "./MatchModal";

export default function MatchNotifier() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [notif, setNotif] = useState(null);

  const { data } = useSubscription(NOTIF_SUBS, {
    skip: authLoading || !user,
    shouldResubscribe: true,
  });

  useEffect(() => {
    const n = data?.notificationAdded;
    if (n?.type === "match") {
      setNotif(n);
    }
  }, [data]);

  const handleClose = () => setNotif(null);
  const handleChat = () => {
    const { matchId } = notif.payload;
    setNotif(null);
    router.push(`/chat/${matchId}`);
  };

  if (!notif) return null;

  const { name, photoUrl } = notif.payload;
  return (
    <MatchModal
      matchedUser={{ name, photoUrl }}
      onClose={handleClose}
      onChat={handleChat}
    />
  );
}
