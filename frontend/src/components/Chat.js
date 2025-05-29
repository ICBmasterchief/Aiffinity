// frontend/src/components/Chat.js
"use client";

import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  GET_CONVERSATION,
  SEND_MESSAGE,
  CONVERSATION_MESSAGE_SUBSCRIPTION,
} from "@/graphql/chatConversation";
import {
  STARTER_STATUS,
  GENERATE_STARTER,
  SYSTEM_TOPIC_ADDED,
} from "@/graphql/chatStarterQueries";
import { AuthContext } from "@/context/AuthContext";
import { useNotifs } from "@/context/NotificationsContext";
import { IoSend } from "react-icons/io5";

export default function Chat({ matchId, chatPartner }) {
  const { user } = useContext(AuthContext);
  const { clearChatNotifications } = useNotifs();

  const {
    data,
    loading: loadingMessages,
    refetch,
  } = useQuery(GET_CONVERSATION, {
    variables: { matchId },
    fetchPolicy: "network-only",
  });

  const {
    data: starterData,
    loading: starterLoading,
    refetch: refetchStarter,
  } = useQuery(STARTER_STATUS, {
    variables: { matchId },
  });

  const [generateStarter, { loading: genLoading }] = useMutation(
    GENERATE_STARTER,
    {
      variables: { matchId },
      onCompleted: () => refetchStarter(),
    }
  );

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

  const { data: subscriptionData, error: subscriptionError } = useSubscription(
    CONVERSATION_MESSAGE_SUBSCRIPTION,
    {
      variables: { matchId },
      shouldResubscribe: true,
    }
  );

  useSubscription(SYSTEM_TOPIC_ADDED, {
    variables: { matchId },
    onData: ({ data }) => {
      const m = data.data?.systemTopicAdded;
      if (m) setMessages((prev) => [...prev, m]);
      refetchStarter();
    },
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (data?.getConversationMessages) {
      setMessages(data.getConversationMessages);
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData?.conversationMessageAdded) {
      setMessages((prev) => [
        ...prev,
        subscriptionData.conversationMessageAdded,
      ]);

      if (
        String(subscriptionData.conversationMessageAdded.senderId) !==
        String(user?.userId)
      ) {
        clearChatNotifications(matchId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionData]);

  useEffect(() => {
    if (subscriptionError) {
      console.error("Error en la suscripción:", subscriptionError);
    }
  }, [subscriptionError]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    clearChatNotifications(matchId);
  }, [matchId, clearChatNotifications]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      senderId: user?.userId,
      content: input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);

    try {
      await sendMessageMutation({
        variables: { matchId, content: input },
      });
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }

    setInput("");
    refetch();
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {!starterLoading &&
          starterData?.starterStatus.canGenerate &&
          !starterData?.starterStatus.hasStarter && (
            <div className="w-full flex justify-center mb-4">
              <button
                onClick={() => generateStarter()}
                disabled={genLoading}
                className="
                 px-4 py-2 rounded-full shadow font-medium text-white
                 bg-gradient-to-r from-[#B89CFF] to-[#E8D7FF]
                 hover:from-[#CBA4FF] hover:to-[#B89CFF]
                 disabled:opacity-60
               "
              >
                {genLoading ? "Generando…" : "💡 Romper el hielo"}
              </button>
            </div>
          )}
        {loadingMessages ? (
          <p>Cargando mensajes...</p>
        ) : (
          messages.map((msg, index) => {
            if (msg.system) {
              return (
                <div key={msg.id} className="text-center my-6">
                  <div
                    className="inline-block bg-purple-100 text-purple-800
                                      px-4 py-3 rounded-xl shadow leading-relaxed
                                      whitespace-pre-line text-sm"
                  >
                    {msg.content}
                  </div>
                </div>
              );
            }
            const isMyMessage = String(msg.senderId) === String(user?.userId);
            return (
              <div
                key={index}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`
                    max-w-[70%] break-words px-4 py-2 rounded-2xl shadow
                    ${
                      isMyMessage
                        ? "bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5] text-slate-700"
                        : "bg-white/70 backdrop-blur text-gray-800"
                    }
                  `}
                >
                  {msg.content}
                </p>
              </div>
            );
          })
        )}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="
          flex items-center gap-2 pt-4
          border-t border-white/40
          bg-white/40 backdrop-blur-md
        "
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="
            flex-1 rounded-full px-4 py-2 mb-5 ml-2
            bg-white/70 backdrop-blur text-gray-800
            focus:outline-none
          "
        />
        <button
          type="submit"
          className="
            p-3 mr-2 mb-4 rounded-full shadow
            bg-gradient-to-r from-[#FF9A9E] to-[#FFD3A5]
            hover:from-[#FFD3A5] hover:to-[#FF9A9E]
            hover:shadow-lg hover:scale-105
            transition
            cursor-pointer disabled:opacity-50
          "
          disabled={!input.trim()}
          aria-label="Enviar"
        >
          <IoSend size={20} />
        </button>
      </form>
    </div>
  );
}
