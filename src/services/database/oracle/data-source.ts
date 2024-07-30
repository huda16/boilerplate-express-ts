import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../../../entity/auth/Users.js";
import dotenv from "dotenv";

dotenv.config();

export const OracleDataSourceAuth = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME_AUTH,
  password: process.env.DB_PASSWORD_AUTH,
  port: Number(process.env.DB_PORT),
  sid: process.env.DB_SID,
  serviceName: process.env.DB_SID,
  synchronize: true,
  logging: false,
  entities: [Users],
  migrations: [],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
});

export const OracleDataSourceMasterData = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME_MASTER_DATA,
  password: process.env.DB_PASSWORD_MASTER_DATA,
  port: Number(process.env.DB_PORT),
  sid: process.env.DB_SID,
  serviceName: process.env.DB_SID,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
});

export const OracleDataSourceInventory = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME_INVENTORY,
  password: process.env.DB_PASSWORD_INVENTORY,
  port: Number(process.env.DB_PORT),
  sid: process.env.DB_SID,
  serviceName: process.env.DB_SID,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
});

export const OracleDataSourceTransaction = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME_TRANSACTION,
  password: process.env.DB_PASSWORD_TRANSACTION,
  port: Number(process.env.DB_PORT),
  sid: process.env.DB_SID,
  serviceName: process.env.DB_SID,
  synchronize: true,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: true,
});
