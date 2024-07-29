// src/config/config.ts
import { Dialect } from "sequelize";

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect; // Specify the dialect type here
  migrationStorage: string;
  migrationStorageTableName: string;
}

interface Config {
  development: DbConfig;
  test: DbConfig;
  production: DbConfig;
}

const config: Config = {
  development: {
    username: "root",
    password: "root",
    database: "FREEPDB1",
    host: "127.0.0.1",
    port: 1539,
    dialect: "oracle", // Ensure this is treated as a Dialect
    migrationStorage: "sequelize",
    migrationStorageTableName: "sequelize_meta",
  },
  test: {
    username: "root",
    password: "root",
    database: "database_test",
    host: "127.0.0.1",
    port: 1539,
    dialect: "oracle", // Ensure this is treated as a Dialect
    migrationStorage: "sequelize",
    migrationStorageTableName: "sequelize_meta",
  },
  production: {
    username: "root",
    password: "root",
    database: "database_production",
    host: "127.0.0.1",
    port: 1539,
    dialect: "oracle", // Ensure this is treated as a Dialect
    migrationStorage: "sequelize",
    migrationStorageTableName: "sequelize_meta",
  },
};

export default config;
