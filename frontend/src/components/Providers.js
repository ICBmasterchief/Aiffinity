// frontend/src/components/Providers.js
"use client";

import { ApolloProvider } from "@apollo/client";
import { AuthProvider } from "@/context/AuthContext";
import { NotifProvider } from "@/context/NotificationsContext";
import client from "@/graphql/apollo-client";

export default function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NotifProvider>{children}</NotifProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
