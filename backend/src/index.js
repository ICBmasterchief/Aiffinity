// backend/src/index.js
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { authenticate, sync } from "./config/database.js";
import typeDefs from "./graphql/typeDefs/index.js";
import resolvers from "./graphql/resolvers/index.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      let user = null;
      if (token) {
        try {
          user = jwt.verify(
            token.replace("Bearer ", ""),
            process.env.JWT_SECRET
          );
        } catch (error) {
          throw new AuthenticationError("Token expirado o inválido");
        }
      }
      return { user };
    },
    introspection: true, // Esto solo para que funcione playground en pro
    playground: true, // -- Esto solo para que funcione playground en pro
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT;

  try {
    await authenticate();
    console.log("Conexión a la base de datos establecida.");

    await sync();
    console.log("Modelos sincronizados con la base de datos.");

    app.listen(PORT, () => {
      console.log(
        `Servidor corriendo en http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
}

startServer();
