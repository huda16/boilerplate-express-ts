import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "",
  process.env.DB_USER || "",
  process.env.DB_PASSWORD || "",
  {
    dialect: "oracle", // or other dialect
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "1921", 10),
  }
);

export { sequelize };
