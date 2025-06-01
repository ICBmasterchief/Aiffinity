// frontend/src/graphql/apollo-client.js
import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const HTTP_URI = BASE_URL ? `${BASE_URL}/graphql` : `/graphql`;

let WS_URI = `/graphql`;
if (BASE_URL) {
  WS_URI = BASE_URL.replace(/^http/, "ws") + "/graphql";
}

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((e) => {
      if (e.extensions?.code === "UNAUTHENTICATED") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    });
  }
  if (networkError) console.error("[Network error]", networkError);
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

function makeWsClient() {
  return createClient({
    url: WS_URI,
    retryAttempts: Infinity,
    connectionParams: () => {
      const token = localStorage.getItem("token");
      return { authorization: token ? `Bearer ${token}` : "" };
    },
  });
}

export let wsClient = makeWsClient();
let wsLink = new GraphQLWsLink(wsClient);

function buildSplit() {
  const httpLink = createUploadLink({ uri: HTTP_URI });
  return split(
    ({ query }) => {
      const def = getMainDefinition(query);
      return (
        def.kind === "OperationDefinition" && def.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
}

const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(buildSplit()),
  cache: new InMemoryCache(),
});

export function renewWebSocket() {
  console.log("🔌 resetting WebSocket link");
  wsClient.dispose?.();
  wsClient = makeWsClient();
  wsLink = new GraphQLWsLink(wsClient);
  client.setLink(errorLink.concat(authLink).concat(buildSplit()));
}

export default client;
