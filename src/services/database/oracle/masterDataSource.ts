import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

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
