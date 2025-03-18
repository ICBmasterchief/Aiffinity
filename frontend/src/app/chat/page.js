// src/app/chat/page.js
"use client";

import { useEffect, useState, useContext, useRef } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { CHAT_WITH_OPENAI, GET_USER_MESSAGES } from "@/graphql/chatQueries";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

function ChatPage() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const chatContainerRef = useRef(null);

  const [chatWithOpenAI, { loading: loadingChat }] = useLazyQuery(
    CHAT_WITH_OPENAI,
    {
      onCompleted: (data) => {
        const aiMessage = { role: "assistant", content: data.chatWithOpenAI };
        setMessages((prev) => [...prev, aiMessage]);
      },
    }
  );

  const { data, loading: loadingMessages } = useQuery(GET_USER_MESSAGES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getUserMessages) {
      setMessages(data.getUserMessages);
    }
  }, [data]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    chatWithOpenAI({ variables: { prompt: input } });
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  if (loadingMessages) {
    return <div>Cargando mensajes...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Chat con ChatGPT</h1>
      <div ref={chatContainerRef} className="border p-4 h-96 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <p
              className={`inline-block p-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </p>
          </div>
        ))}
        {loadingChat && <p>ChatGPT está escribiendo...</p>}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
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

export default ProtectedRoute(ChatPage);
