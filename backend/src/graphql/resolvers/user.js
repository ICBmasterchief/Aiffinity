// backend/src/graphql/resolvers/user.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { GraphQLError } from "graphql";

const userResolvers = {
  Query: {
    getUsers: async () => {
      return await User.findAll();
    },
    getUser: async (_, { id }) => {
      return await User.findByPk(id);
    },
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      if (!/^[\w.+-]+@\w+\.\w+$/.test(email)) {
        throw new GraphQLError("Email no válido", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new GraphQLError("El usuario ya existe", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (password.length < 4) {
        throw new GraphQLError(
          "La contraseña debe tener al menos 4 caracteres",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new GraphQLError("Usuario no encontrado", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new GraphQLError("Contraseña incorrecta", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return token;
    },
    updateProfile: async (
      _,
      { description, age, gender, searchGender, searchMinAge, searchMaxAge },
      context
    ) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        throw new GraphQLError("Usuario no encontrado", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (age < 18 || age > 99) {
        throw new GraphQLError("La edad debe estar entre 18 y 99 años", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (
        (searchMinAge < 18 || searchMinAge > 99) &&
        searchMinAge > searchMaxAge
      ) {
        throw new GraphQLError(
          "La edad mínima de búsqueda debe estar entre 18 y 99 años y ser menor que la edad máxima de búsqueda",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }
      if (
        (searchMaxAge < 18 || searchMaxAge > 99) &&
        searchMaxAge < searchMinAge
      ) {
        throw new GraphQLError(
          "La edad máxima de búsqueda debe estar entre 18 y 99 años y ser mayor que la edad mínima de búsqueda",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }
      const validGender = ["hombre", "mujer"];
      if (gender && !validGender.includes(gender)) {
        throw new GraphQLError("Género no válido", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const validSearch = ["hombres", "mujeres", "ambos"];
      if (searchGender && !validSearch.includes(searchGender)) {
        throw new GraphQLError("Género de búsqueda no válido", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      if (description !== undefined && description.length > 255) {
        throw new GraphQLError(
          "La descripción no puede superar 255 caracteres",
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }
      user.description = description;
      user.age = age;
      user.gender = gender;
      user.searchGender = searchGender;
      user.searchMinAge = searchMinAge;
      user.searchMaxAge = searchMaxAge;

      await user.save();
      return user;
    },
  },
};

export default userResolvers;
