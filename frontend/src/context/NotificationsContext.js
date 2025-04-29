// frontend/src/context/NotificationsContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useSubscription, useMutation } from "@apollo/client";
import {
  GET_NOTIFS,
  NOTIF_SUBS,
  MARK_NOTIFS_READ,
} from "@/graphql/notificationQueries";
import { AuthContext } from "./AuthContext";

const NotifContext = createContext();

export function NotifProvider({ children }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [notifs, setNotifs] = useState([]);

  const { data: initData, refetch } = useQuery(GET_NOTIFS, {
    skip: authLoading || !user,
    fetchPolicy: "network-only",
  });

  const { data: subData } = useSubscription(NOTIF_SUBS, {
    skip: authLoading || !user,
    shouldResubscribe: true,
  });

  const [markRead] = useMutation(MARK_NOTIFS_READ);

  useEffect(() => {
    if (initData?.getNotifications) {
      setNotifs(initData.getNotifications);
    }
  }, [initData]);

  useEffect(() => {
    const n = subData?.notificationAdded;
    if (!n) return;
    setNotifs((prev) => {
      if (n.type === "message") {
        const exists = prev.some(
          (x) => x.type === "message" && x.payload.matchId === n.payload.matchId
        );
        if (exists) return prev;
      }
      return [n, ...prev];
    });
  }, [subData]);

  useEffect(() => {
    if (!user) {
      setNotifs([]);
    } else {
      refetch();
    }
  }, [user, refetch]);

  const clearNotifications = async () => {
    await markRead({ variables: { matchId: null } });
    setNotifs((prev) =>
      prev.map((n) => (n.type === "match" ? { ...n, cleared: true } : n))
    );
  };

  const clearChatNotifications = async (matchId) => {
    await markRead({ variables: { matchId } });
    setNotifs((prev) =>
      prev.filter(
        (n) => !(n.type === "message" && n.payload.matchId === matchId)
      )
    );
  };

  const clearMatchBadge = (matchId) => {
    setNotifs((prev) =>
      prev.map((n) =>
        n.type === "match" && String(n.payload.matchId) === String(matchId)
          ? { ...n, seen: true }
          : n
      )
    );
  };

  return (
    <NotifContext.Provider
      value={{
        notifs,
        clearNotifications,
        clearChatNotifications,
        clearMatchBadge,
      }}
    >
      {children}
    </NotifContext.Provider>
  );
}

export const useNotifs = () => useContext(NotifContext);
