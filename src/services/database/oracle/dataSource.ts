import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../../../entities/auth/Users";
import { Authentications } from "../../../entities/auth/Authentications";
import dotenv from "dotenv";

dotenv.config();

export const OracleDataSource = new DataSource({
  type: "oracle",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  sid: process.env.DB_SID,
  serviceName: process.env.DB_SERVICENAME,
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
  migrationsTableName: "typeorm_migrations",
  migrationsRun: false,
});
