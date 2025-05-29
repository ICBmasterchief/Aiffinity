// backend/src/config/database.js
import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

export const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida con la base de datos.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
    throw error;
  }
};

export const sync = async () => {
  console.log(
    "Sincronización de modelos desactivada. Se usan migraciones para gestionar cambios en el esquema."
  );
};

export default sequelize;
