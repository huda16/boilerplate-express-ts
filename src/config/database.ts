import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";

dotenv.config();

const env = process.env.NODE_ENV || "development";

const databaseConfig = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "database_development",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "database_production",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
  },
};

const currentConfig = databaseConfig[env as keyof typeof databaseConfig];

export const sequelize = new Sequelize({
  username: currentConfig.username,
  password: currentConfig.password,
  database: currentConfig.database,
  host: currentConfig.host,
  port: currentConfig.port,
  dialect: (process.env.DB_DIALECT as Dialect) || "oracle",
});

// Add your models after the Sequelize instance is created
const modelsPath = path.join(__dirname, "../models");
sequelize.addModels([modelsPath]);
