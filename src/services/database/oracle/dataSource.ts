import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "../../../entities/auth/Users";
import dotenv from "dotenv";

dotenv.config();

export const OracleDataSource = new DataSource({
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
