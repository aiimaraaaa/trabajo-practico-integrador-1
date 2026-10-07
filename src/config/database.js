import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Conexión usando variables del .env
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,
  },
);

// Conecta y sincroniza las tablas
export const startDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida.");
    await sequelize.sync({ force: false });
    console.log("Tablas sincronizadas correctamente.");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};