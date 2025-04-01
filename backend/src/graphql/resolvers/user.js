// backend/src/graphql/resolvers/user.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

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
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("El usuario ya existe");
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
        throw new Error("Usuario no encontrado");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Contraseña incorrecta");
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
      { description, age, gender, searchGender, photoUrl },
      context
    ) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      if (description !== undefined) user.description = description;
      user.age = age;
      user.gender = gender;
      user.searchGender = searchGender;
      if (photoUrl !== undefined) user.photoUrl = photoUrl;

      await user.save();
      return user;
    },
  },
};

export default userResolvers;
