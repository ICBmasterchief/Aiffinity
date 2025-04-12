// frontend/src/components/Chat.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CONVERSATION,
  SEND_MESSAGE,
} from "@/graphql/chatConversationQueries";

export default function Chat({ matchId, chatPartner }) {
  const {
    data,
    loading: loadingMessages,
    refetch,
  } = useQuery(GET_CONVERSATION, {
    variables: { matchId },
    fetchPolicy: "network-only",
  });

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (data?.getConversationMessages) {
      setMessages(data.getConversationMessages);
    }
  }, [data]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      senderId: "me",
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
    <div>
      <div ref={chatContainerRef} className="border p-4 h-96 overflow-y-scroll">
        {loadingMessages ? (
          <p>Cargando mensajes...</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.senderId === "me" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`inline-block p-2 rounded ${
                  msg.senderId === "me"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.content}
              </p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l text-black"
          placeholder="Escribe tu mensaje..."
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
