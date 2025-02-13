// src/app/chat/page.js
"use client";

import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { CHAT_WITH_OPENAI } from "@/graphql/chatQueries";
import ProtectedRoute from "@/components/ProtectedRoute";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatWithOpenAI, { loading }] = useLazyQuery(CHAT_WITH_OPENAI);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);

    const currentInput = input;
    setInput("");

    try {
      await chatWithOpenAI({
        variables: { prompt: currentInput, history: updatedHistory },
        onCompleted: (data) => {
          const aiMessage = { role: "assistant", content: data.chatWithOpenAI };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        },
        onError: (error) => {
          console.error("Error:", error);
        },
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Chat con ChatGPT</h1>
      <div className="border p-4 h-96 overflow-y-scroll">
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
        {loading && <p>ChatGPT está escribiendo...</p>}
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
